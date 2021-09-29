export const orderBookReducer = (state, action) => {
    return action.type === "ORDER_BOOK"
      ? { ...action.payload }
      : state === undefined
      ? {
          bids: {},
          asks: {},
          psnap: {},
          mcnt: 0,
        }
      : state;
  };