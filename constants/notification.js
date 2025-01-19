export const notificationTypes = (data) => {
  // owner notification
  return {
    newSession: {
      title: "New Session",
      body: `Session scheduled now on section ${data.section}.`,
      from: data.author,
      time: data.time,
    },
    newPurchaseItem: {
      title: "New Purchase Item",
      body: `New item purchased with name ${data.name} and price ${data.price}.`,
      from: data.author,
      time: data.time,
    },
    newPlayerPurchase: {
      title: "New Purchase",
      body: `Player ${data.playerId} purchased with name ${data.name} and price ${data.price}.`,
      from: data.author,
      time: data.time,
    },
    employeeAcceptOwnerRequest: {
      title: "Accepted Request",
      body: `${data.author} accept your request.`,
      time: data.time,
    },
    employeeRejectOwnerRequest: {
      title: "Rejected Request",
      body: `${data.author} reject your request.`,
      time: data.time,
    },
    // employee notification
    ownerSendRequest: {
      title: "Accepted Request",
      body: `${data.author} send a request to join his team. check your profile to accept his request.`,
      time: data.time,
    },
  };
};
