import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { MessageApiProvider } from "@/hooks";
// import { Provider } from "react-redux";
// import { store } from "@/store";

createRoot(document.getElementById("root")!).render(
	// <Provider store={store}>
	<MessageApiProvider>
		<App />
	</MessageApiProvider>
	// </Provider>
);
