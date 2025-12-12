import { useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { useConfig, useMessage } from "@/hooks";
import type { IHttpResponse, IUseHttpProps, UseHttpState } from "./types";
import { nanoid } from "@reduxjs/toolkit";

export * from "./types";

const handleHttpError = (
  error: any,
  httpStrategy?: Record<number, () => void>
): { message: string; code: number } => {
  const status = error?.response?.status;
  let errorMessage = "";

  switch (status) {
    case 500:
      errorMessage = "Server error";
      break;
    case 502:
      errorMessage = "Service upgrade in progress";
      break;
    case 504:
      errorMessage = "Time out";
      break;
    default:
      errorMessage = error?.response?.data?.meta?.message || error?.message || "Unknown error";
      break;
  }

  if (httpStrategy?.[status]) httpStrategy[status]();

  return { message: errorMessage, code: status || 0 };
};

export const useHttp = <IRequestType = any, IResponseType = any>({
  url,
  method = "get",
  data,
  headers,
  success = {},
  error = {},
  showLoading = false,
}: IUseHttpProps<IResponseType> & { showLoading?: boolean }): UseHttpState<
  IRequestType,
  IResponseType
> => {
  const { token, apiBaseUrl } = useConfig();
  const message = useMessage();

  if (success.message === undefined)
    success.message = !method || method === "get" ? null : "default";
  if (error.message === undefined) error.message = "default";

  const [state, setState] = useState<UseHttpState<IRequestType, IResponseType>>({
    loading: false,
    data: null,
    errorMessage: null,
    fetchData: () => {},
  });

  const fetchData = async (overrideData?: IRequestType) => {
    const loadingKey = nanoid();

    if (showLoading) {
      message.loading({
        content: "Loading...",
        key: loadingKey,
      });
    }

    try {
      setState({ ...state, loading: true });

      const requestData = overrideData ?? data;

      const response: AxiosResponse<IHttpResponse<IResponseType>> = await axios({
        url: `${apiBaseUrl}${url}`,
        method,
        ...(method === "get" ? { params: requestData } : { data: requestData }),
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const responseData = response.data;

      setState({
        data: responseData.data,
        errorMessage: null,
        loading: false,
        fetchData,
      });

      if (success.message) {
        message.success({
          key: loadingKey,
          content:
            success.message === "default"
              ? typeof responseData.data === "string"
                ? responseData.data
                : "Successfully"
              : success.message,
        });
      } else {
        message.dismiss(loadingKey);
      }

      success.action?.({
        data: responseData.data,
        response,
        pagination: responseData.meta?.pagination,
      });
    } catch (err: any) {
      const { message: errorMessage } = handleHttpError(err);

      setState({
        data: null,
        errorMessage,
        loading: false,
        fetchData,
      });

      if (error.message) {
        message.error({
          key: loadingKey,
          content: error.message === "default" ? errorMessage : error.message,
        });
      } else {
        message.dismiss(loadingKey);
      }

      error.action?.({
        data: overrideData ?? data,
        response: err.response,
      });
    }
  };

  return { ...state, fetchData };
};
