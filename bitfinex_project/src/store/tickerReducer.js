export const tickerReducer = (state, action) => {
    return action.type === "TICKER"
      ? [...action.payload]
      : state === undefined
      ? null
      : state;
  };