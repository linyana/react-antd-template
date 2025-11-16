import React, { createContext, useContext, useMemo, useCallback } from "react";
import { message } from "antd";

type MESSAGE_TYPE = "success" | "error" | "info" | "warning" | "loading";

type IMessageType =
	| {
			content: React.ReactNode;
			key?: string | number;
	  }
	| string;

interface MessageApiContextType {
	success: (params: IMessageType) => void;
	error: (params: IMessageType) => void;
	info: (params: IMessageType) => void;
	warning: (params: IMessageType) => void;
	loading: (params: IMessageType) => void;
	dismiss: (key?: string | number) => void;
}

const MessageApiContext = createContext<MessageApiContextType | null>(null);

export const MessageApiProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [messageApi, contextHolder] = message.useMessage();

	const showMessage = useCallback(
		(type: MESSAGE_TYPE, params: IMessageType) => {
			messageApi.open(
				typeof params === "string"
					? {
							type,
							content: params,
							duration: type === "loading" ? 0 : 3,
					  }
					: {
							type,
							duration: type === "loading" ? 0 : 3,
							...params,
					  }
			);
		},
		[messageApi]
	);

	const api = useMemo<MessageApiContextType>(
		() => ({
			success: (p) => showMessage("success", p),
			error: (p) => showMessage("error", p),
			info: (p) => showMessage("info", p),
			warning: (p) => showMessage("warning", p),
			loading: (p) => showMessage("loading", p),
			dismiss: (key) => messageApi.destroy(key),
		}),
		[showMessage, messageApi]
	);

	return (
		<MessageApiContext.Provider value={api}>
			{contextHolder}
			{children}
		</MessageApiContext.Provider>
	);
};

export const useMessage = () => {
	const context = useContext(MessageApiContext);
	if (!context) {
		throw new Error("useMessage must be used within a MessageApiProvider");
	}
	return context;
};
