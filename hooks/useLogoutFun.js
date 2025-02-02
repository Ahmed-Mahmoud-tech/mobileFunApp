import { useDispatch } from "react-redux";
import { setCurrentToken, setStoredUser } from "@/store/slices/user";
import { removeData, saveData } from "@/common/localStorage";
import useRequest from "@/axios/useRequest";
import { useNavigation, useRouter } from "expo-router";
import { ChangeMenuStatus, changeRoute } from "@/store/slices/mainConfig";
import { CommonActions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { DevSettings } from "react-native";

export const useLogoutFun = () => {
  const dispatch = useDispatch();
  const { googleLogOut } = useRequest();
  const router = useRouter();

  const logoutFun = async () => {
    try {
      await removeData("token");
      await removeData("userId");
      await saveData("logout", "true");
      // await removeData("token");
      // await removeData("userId");

      dispatch(setStoredUser(null));
      dispatch(setCurrentToken(""));
      dispatch(ChangeMenuStatus(true));
      // await Linking.openURL("/(tabs)/LoginScreen");

      // setTimeout(() => {
      //   DevSettings.reload();
      // }, 10000);
      await googleLogOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logoutFun;
};
