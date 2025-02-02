import { useDispatch } from "react-redux";
import { setCurrentToken, setStoredUser } from "@/store/slices/user";
import { removeData, saveData } from "@/common/localStorage";
import useRequest from "@/axios/useRequest";
import { useNavigation, useRouter } from "expo-router";
import { ChangeMenuStatus, changeRoute } from "@/store/slices/mainConfig";

export const useLogoutFun = () => {
  const dispatch = useDispatch();
  const { googleLogOut } = useRequest();
  const router = useRouter();
  const navigation = useNavigation();

  const logoutFun = async () => {
    try {
      await removeData("token");
      await removeData("userId");

      dispatch(setStoredUser(null));
      dispatch(setCurrentToken(""));
      dispatch(ChangeMenuStatus(true));
      router.push("/LoginScreen");

      await googleLogOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logoutFun;
};
