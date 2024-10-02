import axios from "axios";


const BASE_URI="http://localhost:5005/api/v1"; //change for deploy

const BASE_URL=`${window.location.origin}/api/v1`

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;