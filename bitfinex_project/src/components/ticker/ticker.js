import React from "react";
import { useSelector } from "react-redux";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io";
import "./ticker.scss";
import { formatNum } from "./../../util";

export const Ticker = (props) => {
  let displayValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const ticker = useSelector((state) => state.ticker);  
  if (ticker && Array.isArray(ticker[1])) {
    displayValues = ticker[1];
  }
  
  const [
     // eslint-disable-next-line
    BID,
     // eslint-disable-next-line
    BID_SIZE,
     // eslint-disable-next-line
    ASK,
     // eslint-disable-next-line
    ASK_SIZE,
    DAILY_CHANGE,
    DAILY_CHANGE_PERC,
    LAST_PRICE,
    VOLUME,
    HIGH,
    LOW,
  ] = displayValues;

  return (
    <React.Fragment>
      <div className="box">
        <div className="icon">
          <IoLogoBitcoin />
        </div>
        <div className="row">
          <h4>BTC/USD</h4>
          <div className="line">
            VOL {VOLUME && formatNum(VOLUME.toFixed(2))} USD
          </div>
          <div className="line">LOW {LOW && formatNum(LOW.toFixed(1))}</div>
        </div>
        <div className="row">
          <h4>{LAST_PRICE && formatNum(LAST_PRICE.toFixed(1))}</h4>
          <div className="line">
            <span
              style={
                DAILY_CHANGE_PERC < 0 ? { color: "red" } : { color: "green" }
              }
            >
              {DAILY_CHANGE && formatNum(DAILY_CHANGE.toFixed(2))}
              {DAILY_CHANGE_PERC > 0 ?  <FaCaretUp /> : <FaCaretDown />}(
              {DAILY_CHANGE_PERC}%)
            </span>
          </div>
          <div className="line">HIGH {HIGH && formatNum(HIGH.toFixed(1))}</div>
        </div>
      </div>
    </React.Fragment>
  );
};