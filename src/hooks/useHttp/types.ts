import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { IPaginationType } from "@/types";

export type IMessageType = "default" | null | string;

export interface IHttpResponse<IResponseType = any> {
  data: IResponseType;
  meta?: {
    pagination?: IPaginationType;
    message?: string;
  };
}

export type IUseHttpProps<IResponseType = any> = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  success?: {
    message?: IMessageType;
    action?: (params: {
      data: IResponseType;
      response: AxiosResponse<IHttpResponse<IResponseType>>;
      pagination: IPaginationType;
    }) => void;
  };
  error?: {
    message?: IMessageType;
    action?: (params: {
      data: any;
      response: AxiosResponse<IHttpResponse<IResponseType>>;
    }) => void;
  };
};

export type IHttpType<TRequest = any, TResponse = any> = Omit<
  IUseHttpProps<TResponse>,
  "url" | "method" | "data"
> & {
  data?: TRequest;
};

export interface UseHttpState<IRequestType = any, IResponseType = any> {
  loading: boolean;
  errorMessage: string | null;
  data: IResponseType | null;
  fetchData: (overrideData?: IRequestType) => void;
  pagination: IPaginationType;
}

export type IHttpGenerics = {
  request?: any;
  response?: any;
};
