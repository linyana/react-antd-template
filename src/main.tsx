import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { MessageApiProvider } from "@/hooks";
// import { Provider } from "react-redux";
// import { store } from "@/store";

createRoot(document.getElementById("root")!).render(
  // <Provider store={store}>
  <MessageApiProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MessageApiProvider>
  // </Provider>
);
