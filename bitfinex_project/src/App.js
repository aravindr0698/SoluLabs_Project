import React, { useEffect, useState } from "react";
import "./App.css";
import { Ticker } from "./components/ticker/ticker";
import { OrderBook } from "./components/orderBook/orderBook";
import establishConnection from "./services/establishConnection";
import { useDispatch } from "react-redux";
import { saveTicker } from "./components/ticker/actions";
import { saveOrderBook } from "./components/orderBook/actions";

function App() {
  const dispatch = useDispatch();
  const [connectionStatus, setConnectionStatus] = useState(true);

  const saveTickerValue = (tickerValues) => {
    dispatch(saveTicker(tickerValues));
  };
  const saveOrderBookValue = (bookValues) => {
    setInterval(() => {
      dispatch(saveOrderBook(bookValues));
    }, 500)
  };

  useEffect(() => {
    establishConnection({
      saveTickerValue: saveTickerValue,
      saveOrderBookValue: saveOrderBookValue,
      connectionState: connectionStatus,
    });
  });

  return (
    <div className="App">
      <Ticker />
      <OrderBook setConnectionStatus={setConnectionStatus} connectionStatus={connectionStatus}/>
    </div>
  );
}

export default App;