import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "@/store";
// import { MessageApiProvider } from "@/hooks";
import "@ant-design/v5-patch-for-react-19";

createRoot(document.getElementById("root")!).render(
	// <Provider store={store}>
	// 	<MessageApiProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
	// 	</MessageApiProvider>
	// </Provider>
);
