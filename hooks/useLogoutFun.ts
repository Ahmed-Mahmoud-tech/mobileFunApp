import { useDispatch } from "react-redux";
import { setCurrentToken, setStoredUser } from "@/store/slices/user";
import { removeData } from "@/common/localStorage";
import useRequest from "@/axios/useRequest";
import { useRouter } from "expo-router";
import { ChangeMenuStatus, changeRoute } from "@/store/slices/mainConfig";

export const useLogoutFun = () => {
  const dispatch = useDispatch();
  const { googleLogOut } = useRequest();
  const router = useRouter();

  const logoutFun = async () => {
    try {
      dispatch(setStoredUser({}));
      await removeData("token");
      await removeData("userId");
      dispatch(ChangeMenuStatus(true));
      await googleLogOut();
      dispatch(changeRoute("LoginScreen"));
      dispatch(setCurrentToken(null));
      // setTimeout(() => {
      router.push("/LoginScreen");
      // }, 3000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logoutFun;
};
