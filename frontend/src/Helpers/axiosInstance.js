import axios from "axios";
const BASE_URL="https://farm2table-2.onrender.com/api/v1"; 
//const BASE_URL="http://localhost:3001/api/v1";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;