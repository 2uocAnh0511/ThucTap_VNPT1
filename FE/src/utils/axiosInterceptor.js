import axios from "axios";
import { toast } from "react-toastify";

const setupAxiosInterceptors = (navigate) => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;

            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpire");

                toast.info("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                navigate("/");
            }

            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;