import useApi from "./useApi"

const useRequest = () => {
  const Request = useApi()

  const googleLogOut = async () => {
    return await Request.get(`api/auth/logout`)
  }
  const getUserInfo = async (userId) => {
    return await Request.get(`api/users/${userId}`)
  }

  const updateUser = async (userId, data) => {
    return await Request.put(`api/users/${userId}`, data)
  }

  /****************         request         ************* */

  const postRequest = async (data) => {
    return await Request.post(`api/requests`, data)
  }
  const getRequest = async () => {
    return await Request.get(`api/requests`)
  }

  const deleteRequest = async (requestId) => {
    return await Request.delete(`api/requests/${requestId}`)
  }

  return {
    getUserInfo,
    googleLogOut,
    updateUser,
    postRequest,
    getRequest,
    deleteRequest,
  }
}
export default useRequest
