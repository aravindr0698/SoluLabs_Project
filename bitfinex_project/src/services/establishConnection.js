import CRC from "crc-32";
import _ from "lodash";

let orderBook = {};
let connected = false;
let connecting = false;
let ws;
let channels = {};
function establishConnection({
  saveOrderBookValue,
  saveTickerValue,
  connectionState,
}) {
  if (!connectionState) {
    ws.close();
    return;
  }
  if (!connecting && !connected)
    ws = new WebSocket("wss://api.bitfinex.com/ws/2", "protocolOne");
  if (!true) {
    ws.close();
    return;
  }
  if (connecting || connected) return;
  connecting = true;

  ws.onopen = () => {
    connecting = false;
    connected = true;
    orderBook.bids = {};
    orderBook.asks = {};
    orderBook.psnap = {};
    orderBook.mcnt = 0;
    ws.send(JSON.stringify({ event: "conf", flags: 65536 + 131072 }));
    ws.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: "BTCUSD",
        prec: "P0",
        len: 25,
        freq: "F0",
      })
    );
    ws.send(
      JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: "tBTCUSD",
      })
    );
  };
  ws.onclose = () => {
    console.log("WS close");
    connecting = false;
    connected = false;
  };

  ws.onmessage = (message) => {
    let msg = JSON.parse(message.data);
    if (msg.event === "subscribed") {
      channels[msg.channel] = msg.chanId;
    }

    if (msg.event) return;

    if (msg[1] === "hb") return;

    if (msg[0] === channels["ticker"]) {
      saveTickerValue(msg);
    }

    if (msg[0] === channels["book"]) {
      if (msg[1] === "cs") {
        const checksum = msg[2];
        const csdata = [];
        const bidsKeys = orderBook.psnap["bids"];
        const asksKeys = orderBook.psnap["asks"];
        for (let i = 0; i < 25; i++) {
          if (bidsKeys[i]) {
            const price = bidsKeys[i];
            const pp = orderBook.bids[price];
            csdata.push(pp.price, pp.amount);
          }
          if (asksKeys[i]) {
            const price = asksKeys[i];
            const pp = orderBook.asks[price];
            csdata.push(pp.price, -pp.amount);
          }
        }
        const csStr = csdata.join(":");
        const csCalc = CRC.str(csStr);
        if (csCalc !== checksum) {
          console.error("CHECKSUM FAILED");
          process.exit(-1);
        } else {
          console.log("Checksum: " + checksum + " success!");
        }
        return;
      }
      if (orderBook.mcnt === 0) {
        _.each(msg[1], function (pp) {
          pp = { price: pp[0], cnt: pp[1], amount: pp[2] };
          const side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          orderBook[side][pp.price] = pp;
        });
      } else {
        msg = msg[1];
        const pp = { price: msg[0], cnt: msg[1], amount: msg[2] };
        if (!pp.cnt) {
          let found = true;

          if (pp.amount > 0) {
            if (orderBook["bids"][pp.price]) {
              delete orderBook["bids"][pp.price];
            } else {
              found = false;
            }
          } else if (pp.amount < 0) {
            if (orderBook["asks"][pp.price]) {
              delete orderBook["asks"][pp.price];
            } else {
              found = false;
            }
          }

          if (!found) {
            console.error("Book delete failed. Price point not found");
          }
        } else {
          const side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          orderBook[side][pp.price] = pp;
        }

        _.each(["bids", "asks"], function (side) {
          const sbook = orderBook[side];
          const bprices = Object.keys(sbook);
          const prices = bprices.sort(function (a, b) {
            if (side === "bids") {
              return +a >= +b ? -1 : 1;
            } else {
              return +a <= +b ? -1 : 1;
            }
          });
          orderBook.psnap[side] = prices;
        });
      }
      orderBook.mcnt++;
     saveOrderBookValue(orderBook)
      
    }
  };
}
export default establishConnection;