import axios from "axios";
import { useDispatch } from "react-redux";
import { changePreloader } from "@/store/slices/mainConfig";
// import { toast } from "react-toastify"
// import { logOut } from "../store/slices/auth"
// import { addUserInfo } from "../store/slices/auth"
// import { Client_id } from "../const"
import { BACKEND_URL } from "@/constants/main";
import { getData, removeData } from "@/common/localStorage";
import { useNavigation } from "@react-navigation/native"; // or any navigation library you're using
import { backToLoginFun } from "@/store/slices/mainConfig";

const useApi = () => {
  let axiosObject = {
    baseURL: BACKEND_URL,
  };
  const navigation = useNavigation(); // Hook into the navigation context

  const mainInstance = axios.create(axiosObject);
  const dispatch = useDispatch();
  const noLoadingRoutes = "api/notifications/count";
  mainInstance.interceptors.request.use(
    async function (config) {
      !config.url.includes(noLoadingRoutes) && dispatch(changePreloader(true));

      const noAuthRoutes = ["api/auth/google", "api/auth/google/callback"];
      //* add auth
      if (!noAuthRoutes.includes(config.url)) {
        const localStorageToken = await getData("token");
        console.log("localStorageToken", localStorageToken);
        config.headers.Authorization = localStorageToken
          ? `Bearer ${localStorageToken}`
          : "";
      } else {
        // config.headers["Client-Id"] = Client_id
      }
      //* end auth
      return config;
    },
    (error) => {
      //if err don't do any thing and i will handel it in my global handel error
      return Promise.reject(error);
    }
  );

  mainInstance.interceptors.response.use(
    async (res) => {
      dispatch(changePreloader(false));
      // res.data?.data?.token?.accessToken &&
      //   localStorage.setItem("token", res.data?.data?.token?.accessToken)
      // const roles = ["", "superAdmin"]
      // if (res.data?.data?.userAccount?.email) {
      //   dispatch(
      //     addUserInfo({
      //       email: res.data?.data?.userAccount?.email,
      //       role: roles[res.data?.data?.userAccount?.userType],
      //     })
      //   )
      // }

      return res;
    },

    async (err) => {
      dispatch(changePreloader(false));
      console.log(err);
      if (
        err?.response?.data === "Invalid Token" ||
        err?.response?.data === "Access Denied" ||
        err?.status == 500
      ) {
        dispatch(backToLoginFun(true));

        return null;
      } else {
        return Promise.reject(err);
      }
      // if (err?.response?.status == 401) {
      //   dispatch(logOut())
      //   return Promise.reject(err)
      // }

      // if (err?.response?.data?.metadata) {
      //   //when the Access Token is expired
      //   err.response.data.metadata.errors.map((element) => {
      //     toast.error(element.message, {
      //       position: toast.POSITION.TOP_CENTER,
      //     })
      //   })
      // }
      // return Promise.reject(err);
    }
  );
  return mainInstance;
};

export default useApi;
