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
      console.log("Starting logout process...");
      await removeData("token");
      await removeData("userId");
      dispatch(ChangeMenuStatus(true));
      dispatch(setStoredUser({}));
      // await googleLogOut();
      dispatch(changeRoute("LoginScreen"));
      router.push("/LoginScreen");
      dispatch(setCurrentToken(null));
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logoutFun;
};
