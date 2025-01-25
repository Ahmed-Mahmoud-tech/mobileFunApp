import { utcToLocal } from "@/common/time";

export const notificationTypes = (data) => {
  // owner notification
  return {
    newSession: {
      title: "New Session",
      body: `Session scheduled now on section ${data.section} by ${data.author}.`,
      from: data.author,
      time: data.time,
    },
    deleteSession: {
      title: "Delete Session",
      body: `The session that start at ${utcToLocal(data.start)} on section ${
        data.section
      } has been deleted by ${data.author}.`,
      from: data.author,
      time: data.time,
    },
    updatedSession: {
      title: "Update Session",
      body: `The session that start at ${utcToLocal(
        data.start
      )} has been updated by ${data.author}.`,
      from: data.author,
      time: data.time,
    },
    newPurchaseItem: {
      title: "New Purchase Item",
      body: `New item purchased with name ${data.name} and price ${data.price}.`,
      from: data.author,
      time: data.time,
    },
    updatePurchaseItem: {
      title: "Update Purchase Item",
      body: `Update purchased item with name ${data.name}${
        data.newName ? " to be " + data.newName : ""
      }.`,
      from: data.author,
      time: data.time,
    },
    deletePurchaseItem: {
      title: "Delete Purchase Item",
      body: `Delete item purchased with name ${data.name}`,
      from: data.author,
      time: data.time,
    },
    // add note for session checkout update also
    // newCheckout: {
    //   title: "Checkout",
    //   body: `Player ${data.playerId} checkout now. with a mount of ${data.amount}.`,
    //   from: data.author,
    //   time: data.time,
    // },
    // UpdateCheckout: {
    //   title: "Update Checkout",
    //   body: `Player ${data.playerId} checkout canceled.`,
    //   from: data.author,
    //   time: data.time,
    // },
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
    ownerRemoveRequest: {
      title: "Remove Request",
      body: `${data.author} remove a request to get out his team.`,
      time: data.time,
    },
  };
};
