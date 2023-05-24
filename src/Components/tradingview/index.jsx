/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Datafeed from "./datafeed";

const Chart = (props) => {

  const { symbol, tokenId, interval, width, height } = props;

  useEffect(() => {
    if (symbol && interval) {

      // eslint-disable-next-line no-undef
      const widget = (window.tvWidget = new TradingView.widget({
        symbol: symbol,
        interval: interval,
        fullscreen: false,
        width: "100%",
        height: "100%",
        container_id: "tv_chart_container",
        datafeed: Datafeed(tokenId),
        library_path: "/charting_library/",
        overrides: {
          "paneProperties.vertGridProperties.color": "#E3E3E5", // Grid Vertical Lines Color
          "paneProperties.horzGridProperties.color": "#E3E3E5", // Grid Horizontal Lines Color
          "mainSeriesProperties.candleStyle.upColor": "#11CC9A", // Up Candle Color
          "mainSeriesProperties.candleStyle.downColor": "#E20E7C", // Down Candle Color
          "mainSeriesProperties.candleStyle.borderUpColor": "#11CC9A", // Up Candle Border Color
          "mainSeriesProperties.candleStyle.borderDownColor": "#E20E7C", // Down Candle Border Color
          "mainSeriesProperties.candleStyle.drawBorder": false, // Disable candle borders
        },
        disabled_features: ["header_symbol_search"],
        time_frames: [],
        theme: "Dark",
        pricescale: 10000
      }));

      widget.onChartReady(async () => {
        widget.activeChart().setTimezone('UTC');
      })
    }
  }, [symbol, interval]);
  return <div id="tv_chart_container" height={height} width={width} style={{ height: 400 }}></div>;
}

export default Chart;