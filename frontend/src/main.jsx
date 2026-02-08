import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./shared/context/AuthContext";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { RouterProvider } from "react-router-dom";
import router from "./shared/router";
import { ChatProvider } from "./shared/context/ChatContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChatProvider>
        <GlobalStyles />
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
