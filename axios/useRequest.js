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

  const getOwnerRequest = async () => {
    return await Request.get(`api/requests/owner`)
  }

  const getEmployeeRequest = async () => {
    return await Request.get(`api/requests/employee`)
  }

  const updateRequest = async (requestId, data) => {
    return await Request.put(`api/requests/${requestId}`, data)
  }

  const deleteRequest = async (requestId) => {
    return await Request.delete(`api/requests/${requestId}`)
  }

  /*******************  rooms  ******************** */

  const postRoom = async (data) => {
    return await Request.post(`api/sections`, data)
  }

  const getRooms = async () => {
    return await Request.get(`api/sections`)
  }

  const updateRoom = async (id, data) => {
    return await Request.put(`api/sections/${id}`, data)
  }

  const deleteRoom = async (id) => {
    return await Request.delete(`api/sections/${id}`)
  }

  /*******************  purchaseItem  ******************** */

  const postItem = async (data) => {
    return await Request.post(`api/purchasesItems`, data)
  }

  const getItems = async () => {
    return await Request.get(`api/purchasesItems`)
  }

  const updateItem = async (id, data) => {
    return await Request.put(`api/purchasesItems/${id}`, data)
  }

  const deleteItem = async (id) => {
    return await Request.delete(`api/purchasesItems/${id}`)
  }
  /*******************   games  ******************** */

  const postGame = async (data) => {
    return await Request.post(`api/games`, data)
  }

  const getGames = async () => {
    return await Request.get(`api/games`)
  }

  const updateGame = async (id, data) => {
    return await Request.put(`api/games/${id}`, data)
  }

  const deleteGame = async (id) => {
    return await Request.delete(`api/games/${id}`)
  }
  /*******************   player purchases  ******************** */

  const postPurchases = async (data) => {
    return await Request.post(`api/playersPurchases`, data)
  }

  const getPurchases = async (params) => {
    return await Request.get(`api/playersPurchases`, params)
  }

  const updatePurchases = async (id, data) => {
    return await Request.put(`api/playersPurchases/${id}`, data)
  }

  const deletePurchases = async (id) => {
    return await Request.delete(`api/playersPurchases/${id}`)
  }

  const playerIdList = async () => {
    return await Request.get(`api/playersPurchases/newPlayerId`)
  }

  /*******************   player Sessions  ******************** */

  const postSessions = async (data) => {
    return await Request.post(`api/sessions`, data)
  }

  const getSessions = async (params) => {
    return await Request.get(`api/sessions`, params)
  }

  const updateSessions = async (id, data) => {
    return await Request.put(`api/sessions/${id}`, data)
  }

  const deleteSessions = async (id) => {
    return await Request.delete(`api/sessions/${id}`)
  }

  return {
    getUserInfo,
    googleLogOut,
    updateUser,
    postRequest,
    getOwnerRequest,
    getEmployeeRequest,
    deleteRequest,
    postRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    postItem,
    getItems,
    updateItem,
    deleteItem,
    postGame,
    getGames,
    updateGame,
    deleteGame,
    postPurchases,
    getPurchases,
    updatePurchases,
    deletePurchases,
    playerIdList,
    postSessions,
    getSessions,
    updateSessions,
    deleteSessions,
    updateRequest,
  }
}
export default useRequest
