import axios from "axios";
// import Cookies from "js-cookie";

let token = "";

// if (typeof window !== "undefined") {
//   token = Cookies.get("token");
// }

const baseURL = process.env.NEXT_PUBLIC_SPS_SERVICE_URL;
console.log(baseURL, "baseURLbaseURLbaseURL");

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
