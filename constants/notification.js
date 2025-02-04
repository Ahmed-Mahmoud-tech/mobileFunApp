import { utcToLocal } from "@/common/time";

export const notificationTypes = (t, data) => {
  return {
    newSession: {
      title: t("New_Session"),
      body: t("Session_scheduled_now_on_section", {
        section: data.section,
        author: data.author,
      }),
      from: data.author,
      time: data.time,
    },
    deleteSession: {
      title: t("Delete_Session"),
      body: t("The_session_that_start_at_on_section_has_been_deleted_by", {
        start: utcToLocal(data.start),
        section: data.section,
        author: data.author,
      }),
      from: data.author,
      time: data.time,
    },
    updatedSession: {
      title: t("Update_Session"),
      body: t("The_session_that_start_at_has_been_updated_by", {
        start: utcToLocal(data.start),
        author: data.author,
      }),
      from: data.author,
      time: data.time,
    },
    newPurchaseItem: {
      title: t("New_Purchase_Item"),
      body: t("New_item_purchased_with_name_and_price", {
        name: data.name,
        price: data.price,
      }),
      from: data.author,
      time: data.time,
    },
    updatePurchaseItem: {
      title: t("Update_Purchase_Item"),
      body: t("Update_purchased_item_with_name_to_be", {
        name: data.name,
        newName: data.newName,
      }),
      from: data.author,
      time: data.time,
    },
    deletePurchaseItem: {
      title: t("Delete_Purchase_Item"),
      body: t("Delete_item_purchased_with_name", { name: data.name }),
      from: data.author,
      time: data.time,
    },
    sessionCheckout: {
      title: t("Session_Checkout"),
      body: t("Player_checkout_now_for_room_worth", {
        playerId: data.playerId,
        section: data.section,
        amount: data.amount,
      }),
      from: data.author,
      time: data.time,
    },
    cancelSessionCheckout: {
      title: t("Cancel_Session_Checkout"),
      body: t("Player_checkout_cancel_now_for_room_worth", {
        playerId: data.playerId,
        section: data.section,
        amount: data.amount,
      }),
      from: data.author,
      time: data.time,
    },
    itemCheckout: {
      title: t("Purchase_Item_Checkout"),
      body: t("Player_checkout_now_for_item_worth_with_count", {
        playerId: data.playerId,
        item: data.item,
        amount: data.amount,
        count: data.count,
      }),
      from: data.author,
      time: data.time,
    },
    cancelItemCheckout: {
      title: t("Cancel_Purchase_Item_Checkout"),
      body: t("Player_checkout_cancel_now_for_item_with_count", {
        playerId: data.playerId,
        item: data.item,
        count: data.count,
      }),
      from: data.author,
      time: data.time,
    },
    employeeAcceptOwnerRequest: {
      title: t("Accepted_Request"),
      body: t("accept_your_request", { author: data.author }),
      time: data.time,
    },
    employeeRejectOwnerRequest: {
      title: t("Rejected_Request"),
      body: t("reject_your_request", { author: data.author }),
      time: data.time,
    },
    ownerSendRequest: {
      title: t("Accepted_Request"),
      body: t("send_a_request_to_join_his_team", { author: data.author }),
      time: data.time,
    },
    ownerRemoveRequest: {
      title: t("Remove_Request"),
      body: t("remove_a_request_to_get_out_his_team", { author: data.author }),
      time: data.time,
    },
  };
};
