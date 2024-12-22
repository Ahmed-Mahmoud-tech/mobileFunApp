import { useDispatch } from "react-redux"
import { setStoredUser } from "@/store/slices/user"
import { removeData } from "@/common/localStorage"
import useRequest from "@/axios/useRequest"
import { useRouter } from "expo-router"
import { ChangeMenuStatus, changeRoute } from "@/store/slices/mainConfig"

export const useLogoutFun = () => {
  const dispatch = useDispatch()
  const { googleLogOut } = useRequest()
  const router = useRouter()

  const logoutFun = async () => {
    dispatch(changeRoute("LoginScreen"))
    router.push("/LoginScreen")
    console.log("00000000000000000123")
    await removeData("token")
    await removeData("userId")
    dispatch(ChangeMenuStatus(true))
    dispatch(setStoredUser({}))
    googleLogOut()
  }

  return logoutFun
}
