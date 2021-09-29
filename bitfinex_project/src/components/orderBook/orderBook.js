import React from "react";
import { useSelector } from "react-redux";
import { formatNum } from "../../util";
import "./orderBook.scss";

export const OrderBook = (props) => {
  const { setConnectionStatus, connectionStatus } = props;
  const book = useSelector((state) => state.orderBook);
  const { bids, asks } = book;

  const _asks =
    asks &&
    Object.keys(asks)
      .slice(0, 21)
      .reduce((acc, k, i) => {
        const total = Object.keys(asks)
          .slice(0, i + 1)
          .reduce((t, i) => {
            t = t + asks[i].amount;
            return t;
          }, 0);
        const item = asks[k];
        acc[k] = { ...item, total };
        return acc;
      }, {});
  const maxAsksTotal = Object.keys(_asks).reduce((t, i) => {
    if (t < _asks[i].total) {
      return _asks[i].total;
    } else {
      return t;
    }
  }, 0);
  const _bids =
    bids &&
    Object.keys(bids)
      .slice(0, 21)
      .reduce((acc, k, i) => {
        const total = Object.keys(bids)
          .slice(0, i + 1)
          .reduce((t, i) => {
            t = t + bids[i].amount;
            return t;
          }, 0);
        const item = bids[k];
        acc[k] = { ...item, total };
        return acc;
      }, {});
  const maxBidsTotal = Object.keys(_bids).reduce((t, i) => {
    if (t < _bids[i].total) {
      return _bids[i].total;
    } else {
      return t;
    }
  }, 0);

  return (
    <React.Fragment>
      <div className="book-table">
        <div className="header">
          <h3>
            Order Book <span>BTC/USD</span>
          </h3>
          <div className="header-right">
            {connectionStatus ? (
              <div className="icon" onClick={()=> setConnectionStatus(false)}>
                Disconnect
              </div>
            ) : (
                <div className="icon"  onClick={()=> setConnectionStatus(true)}>            
                  Connect
                </div>
            )}
          </div>
        </div>
        <div className="flex-display">
          <table className="table">
            <thead>
              <tr className="table-row">
                <td className="table-column count">Count</td>
                <td className="table-column">Amount</td>
                <td className="table-column total">Total</td>
                <td className="table-column">Price</td>
              </tr>
            </thead>
            <tbody>
              {_bids &&
                Object.keys(_bids).map((k, i) => {
                  const item = _bids[k];
                  const { cnt, amount, price, total } = item;
                  const percentage = (total * 100) / (maxBidsTotal * 1.0);
                  return (
                    <tr
                      className="table-row"
                      key={`book-${cnt}${amount}${price}${total}`}
                      style={{
                        backgroundImage: `linear-gradient(to left, #314432 ${percentage}%, #1b262d 0%)`,
                      }}
                    >
                      <td className="table-column count">{cnt}</td>
                      <td className="table-column">{amount.toFixed(2)}</td>
                      <td className="table-column" >
                        {total.toFixed(2)}
                      </td>
                      <td className="table-column">
                        {formatNum(price.toFixed(2))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <table className="table">
            <thead>
              <tr className="table-row">
                <td className="table-column">Price</td>
                <td className="table-column total">Total</td>
                <td className="table-column">Amount</td>
                <td className="table-column count">Count</td>
              </tr>
            </thead>
            <tbody>
              {_asks &&
                Object.keys(_asks).map((k, i) => {
                  const item = _asks[k];
                  const { cnt, amount, price, total } = item;
                  const percentage = (total * 100) / (maxAsksTotal * 1.0);
                  return (
                    <tr
                      className="table-row"
                      style={{
                        backgroundImage: `linear-gradient(to right, #402c33 ${percentage}%, #1b262d 0%)`,
                      }}
                    >
                      <td className="table-column">
                        {formatNum(price.toFixed(2))}
                      </td>
                      <td className="table-column total">{total.toFixed(2)}</td>
                      <td className="table-column">{amount.toFixed(2)}</td>
                      <td className="table-column count">{cnt}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};