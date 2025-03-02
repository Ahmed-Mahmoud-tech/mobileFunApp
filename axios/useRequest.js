import useApi from "./useApi";

const useRequest = () => {
  const Request = useApi();

  const googleLogOut = async () => {
    return await Request.get(`api/auth/logout`);
  };
  const expoRegister = async (body) => {
    return await Request.post(`api/auth/expoRegister`, body);
  };

  const getUserInfo = async (userId) => {
    return await Request.get(`api/users/${userId}`);
  };

  const updateUser = async (userId, data) => {
    return await Request.put(`api/users/${userId}`, data);
  };

  /****************         request         ************* */

  const postRequest = async (data) => {
    return await Request.post(`api/requests`, data);
  };

  const getOwnerRequest = async () => {
    return await Request.get(`api/requests/owner`);
  };

  const getEmployeeRequest = async () => {
    return await Request.get(`api/requests/employee`);
  };

  const updateRequest = async (requestId, data) => {
    return await Request.put(`api/requests/${requestId}`, data);
  };

  const deleteRequest = async (query) => {
    return await Request.delete(`api/requests?${query}`);
  };

  /*******************  rooms  ******************** */

  const postRoom = async (data) => {
    return await Request.post(`api/sections`, data);
  };

  const getRooms = async (id) => {
    return await Request.get(`api/sections/${id}`);
  };

  const updateRoom = async (id, data) => {
    return await Request.put(`api/sections/${id}`, data);
  };

  const deleteRoom = async (id) => {
    return await Request.delete(`api/sections/${id}`);
  };

  /*******************  purchaseItem  ******************** */

  const postItem = async (data) => {
    return await Request.post(`api/purchasesItems`, data);
  };

  const getItems = async () => {
    return await Request.get(`api/purchasesItems`);
  };

  const updateItem = async (id, data) => {
    return await Request.put(`api/purchasesItems/${id}`, data);
  };

  const deleteItem = async (query) => {
    return await Request.delete(`api/purchasesItems?${query}`);
  };
  /*******************   games  ******************** */

  const postGame = async (data) => {
    return await Request.post(`api/games`, data);
  };

  const getGames = async () => {
    return await Request.get(`api/games`);
  };

  const updateGame = async (id, data) => {
    return await Request.put(`api/games/${id}`, data);
  };

  const deleteGame = async (id) => {
    return await Request.delete(`api/games/${id}`);
  };
  /*******************   player purchases  ******************** */

  const postPurchases = async (data) => {
    return await Request.post(`api/playersPurchases`, data);
  };

  const getPurchases = async (params) => {
    return await Request.get(`api/playersPurchases`, params);
  };

  const updatePurchases = async (id, data) => {
    return await Request.put(`api/playersPurchases/${id}`, data);
  };

  const deletePurchases = async (id) => {
    return await Request.delete(`api/playersPurchases/${id}`);
  };

  const playerIdList = async () => {
    return await Request.get(`api/playersPurchases/newPlayerId`);
  };

  /*******************   player Sessions  ******************** */

  const postSessions = async (data) => {
    return await Request.post(`api/sessions`, data);
  };

  const getSessions = async (params) => {
    return await Request.get(`api/sessions`, params);
  };

  const updateSessions = async (id, data) => {
    return await Request.put(`api/sessions/${id}`, data);
  };

  const deleteSessions = async (queryString) => {
    return await Request.delete(`api/sessions?${queryString}`);
  };

  /*******************   player Sessions  ******************** */

  const getNotification = async (idWParams) => {
    return await Request.get(`api/notifications/${idWParams}`);
  };

  const updateNotification = async (data) => {
    return await Request.put(`api/notifications`, data);
  };

  const getNotificationCount = async (id) => {
    return await Request.get(`api/notifications/count/${id}`);
  };

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
    getNotification,
    getNotificationCount,
    updateNotification,
    expoRegister,
  };
};
export default useRequest;
