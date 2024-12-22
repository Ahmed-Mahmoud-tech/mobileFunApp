import useApi from "./useApi"

const useRequest = () => {
  const Request = useApi()

  const googleLogOut = async () => {
    return await Request.get(`api/auth/logout`)
  }
  const getUserInfo = async (userId) => {
    return await Request.get(`api/users/${userId}`)
  }
  const postUserInfo = async (data) => {
    return await Request.post(`api/users`, data)
  }
  const updateUser = async (userId, data) => {
    return await Request.put(`api/users/${userId}`, data)
  }

  return { getUserInfo, postUserInfo, googleLogOut, updateUser }
}
export default useRequest
