import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'react-range-slider-input/dist/style.css';
import { registerSW } from "virtual:pwa-register";
import setupAxiosInterceptors from "../src/utils/axiosInterceptor";

// Component bọc để dùng useNavigate trong useEffect
const AppWrapper = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Khởi tạo Axios Interceptor
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return <App />;
};

if (import.meta.env.MODE === "production") {
  registerSW();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);

AOS.init();

