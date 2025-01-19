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
      await removeData("token");
      await removeData("userId");
      dispatch(ChangeMenuStatus(true));
      dispatch(setCurrentToken(null));
      router.push("/LoginScreen");
      await googleLogOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logoutFun;
};
