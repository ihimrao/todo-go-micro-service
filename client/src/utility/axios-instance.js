import axios from "axios";
import { Cookies } from "../shared/utility";

const instance = axios.create({
    baseURL: "http://localhost:8080/",
});

instance.interceptors.request.use(
    function (config) {
        let token = Cookies.getCookie("token");
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        if (token) {
            config.headers["Token"] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            Cookies.deleteCookie("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default instance;
