export const saveOrderBook = (payload) => ({
    type: "ORDER_BOOK",
    payload,
    meta: {
      throttle: 500,
    },
  });