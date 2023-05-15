/* eslint-disable no-unused-vars */
import * as env from '../../env'
var latestBar;
const sendResolutions = {
  1: "1min",
  5: "5min",
  15: "15min",
  30: "30min",
  45: "45min",
  60: "1h",
  120: "2h",
  240: "4h",
  "1D": "1day",
};

function printDate(mm) {
  let date = new Date(mm);
  let tt =
    date.getFullYear() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return tt;
}

export const configurationData = {
  supported_resolutions: ["5", "15", "30", "45", "60", "120", "240", "1D"],
};

function convertResolution(resolution) {
  var interval;
  if (resolution === "1") {
    interval = "1m";
  } else if (resolution === "5") {
    interval = "5m";
  } else if (resolution === "10") {
    interval = "10m";
  } else if (resolution === "15") {
    interval = "15m";
  } else if (resolution === "30") {
    interval = "30m";
  } else if (resolution === "45") {
    interval = "45m";
  } else if (resolution === "60") {
    interval = "1h";
  } else if (resolution === "120") {
    interval = "2h";
  } else if (resolution === "240") {
    interval = "4h";
  } else if (resolution === "1D") {
    interval = "24h";
  } else {
    interval = resolution;
  }
  return interval;
}

const INTERVAL_SECONDS = {
  "1m": 60,
  "5m": 300,
  "10m": 600,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "12h": 43200,
  "24h": 86400,
};

// Chart Methods
// eslint-disable-next-line import/no-anonymous-default-export
const datafeed = (tokenId) => {
  return {
    onReady: (callback) => {
      setTimeout(() => callback(configurationData));
    },
    searchSymbols: async () => {
      // Code here...
    },
    resolveSymbol: async (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback
    ) => {
      const symbolInfo = {
        name: symbolName,
        has_intraday: true,
        has_no_volume: false,
        session: "24x7",
        timezone: "Europe/Athens",
        exchange: "tradEAsy",
        minmov: 1,
        has_weekly_and_monthly: true,
        volume_precision: 2,
        data_status: "streaming",
        supported_resolutions: configurationData.supported_resolutions,
      };
      onSymbolResolvedCallback(symbolInfo);
    },

    getBars: async (
      symbolInfo,
      resolution,
      from,
      to,
      onHistoryCallback,
      onErrorCallback,
      firstDataRequest
    ) => {
      const resName = sendResolutions[resolution];
      try {
        // let url = `https://api.twelvedata.com/time_series?symbol=${symbolInfo.name}&outputsize=1000&interval=${resName}&apikey=${API_KEY}`;
        let url = `${env.BASE_URL}/api/feed/getfeeddata?tokenId=${tokenId}&from=${from}&to=${to}`;
        console.log(url);

        const response = await fetch(url);
        if (response.status !== 200) {
          onHistoryCallback([], { noData: false });
          return;
        }
        const data = await response.json();

        if (!data.length) {
          onHistoryCallback([], { noData: true });
        }

        let bars = data.map((el) => {
          let dd = new Date(el.startTimestampSeconds * 1000);
          return {
            time: dd.getTime(), //TradingView requires bar time in ms
            low: el.low,
            high: el.high,
            open: el.open,
            close: el.close,
            volume: el.volumeUsd,
          };
        });
        bars = bars.sort(function (a, b) {
          if (a.time < b.time) return -1;
          else if (a.time > b.time) return 1;
          return 0;
        });

        latestBar = bars[bars.length - 1];
        window.delta = 0;

        onHistoryCallback(bars, { noData: false });
      } catch (error) {
        onErrorCallback(error);
      }
    },
    // subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {

    //   const resName = sendResolutions[resolution];
    //   const symbolName = symbolInfo.name;
    //   console.log('[rec]', symbolInfo.name, resolution, resName)

    //   try {
    //     let ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`);
    //     ws.onopen = (e) => {
    //       window.delta = 0;
    //       console.log('[ws onopen]');
    //       let sendData = {
    //         "action": "subscribe",
    //         "params": {
    //           "symbols": [{
    //             "symbol": symbolName,
    //             "exchange": "NASDAQ",
    //             "price": true
    //           }],
    //           "event": "price"
    //         }
    //       }
    //       ws.send(JSON.stringify(sendData));
    //     }

    //     ws.onmessage = e => {
    //       let transaction = JSON.parse(e.data);

    //       console.log('[onmsg]', transaction);
    //       if (transaction.event == 'price') {
    //         const seconds = INTERVAL_SECONDS[convertResolution(resolution)]

    //         var txTime = Math.floor(transaction.timestamp / seconds) * seconds * 1000 - (1440 + 30) * 60 * 1000
    //         console.log('[input_time]', printDate(latestBar.time), printDate(txTime));

    //         var current = new Date();
    //         // var d_time = (current.getDate() * 86400 + current.getHours() * 3600 + current.getMinutes() * 60) - (current.getUTCDate() * 86400 + current.getUTCHours() * 3600 + current.getUTCMinutes() * 60) + 73800;
    //         var d_time = (16 * 60 + 30) * 60 * 1000;

    //         if(window.delta == 0) {
    //           window.delta = latestBar.time - txTime;
    //         }

    //         txTime += window.delta;

    //         console.log("[delta time]", printDate(latestBar.time), printDate(txTime));

    //         if (latestBar && txTime == latestBar.time) {
    //           latestBar.close = transaction.price
    //           if (transaction.price > latestBar.high) {
    //             latestBar.high = transaction.price
    //           }

    //           if (transaction.price < latestBar.low) {
    //             latestBar.low = transaction.price
    //           }

    //           latestBar.volume += transaction.day_volume
    //           console.log('[update bar]', printDate(latestBar.time));
    //           onRealtimeCallback(latestBar)
    //         } else if (latestBar && txTime > latestBar.time) {
    //           const newBar = {
    //             low: transaction.price,
    //             high: transaction.price,
    //             open: transaction.price,
    //             close: transaction.price,
    //             volume: transaction.day_volume,
    //             time: txTime
    //           }
    //           latestBar = newBar
    //           console.log('[new Bar]', printDate(newBar.time))
    //           onRealtimeCallback(newBar)
    //         }

    //         // lastBar.time
    //       }

    //     }

    //     ws.onclose = function () {
    //       console.log('[onclose]');
    //     }

    //   } catch (err) {
    //     console.log(err);
    //   }
    //   // Code here...
    //   window.resetCacheNeededCallback = onResetCacheNeededCallback;
    // },
    // unsubscribeBars: (subscriberUID) => {
    //   // Code here...
    // },
  };
};

export default datafeed
