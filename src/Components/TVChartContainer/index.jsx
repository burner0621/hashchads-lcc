import * as React from 'react';
import './index.css';
import Datafeed from './api/';


const INTERVAL = {
  MINUTES_5: '5',
  MINUTES_15: '15',
  MINUTES_30: '30',
  HOUR: '60',
  HOURS_3: '180',
  HOURS_6: '360',
  HOURS_12: '720',
  DAY: 'D',
  WEEK: 'W',
}

const TIME_FRAMES = [
  { text: '1y', resolution: INTERVAL.DAY, description: '1 Year' },
  { text: '3m', resolution: INTERVAL.HOURS_12, description: '3 Months' },
  { text: '1m', resolution: INTERVAL.HOURS_6, description: '1 Month' },
  { text: '7d', resolution: INTERVAL.HOUR, description: '7 Days' },
  { text: '3d', resolution: INTERVAL.MINUTES_30, description: '3 Days' },
  { text: '1d', resolution: INTERVAL.MINUTES_15, description: '1 Day' },
  { text: '6h', resolution: INTERVAL.MINUTES_5, description: '6 Hours' },
  { text: '1h', resolution: INTERVAL.MINUTE, description: '1 Hour' },
]

export class TVChartContainer extends React.PureComponent {

  static defaultProps = {
    symbol: 'BTC/USD',
    interval: '15',
    containerId: 'tv-chart',
    libraryPath: "/charting_library/",
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    theme: 'Dark'
  };

  componentDidMount() {
    const widgetOptions = {
      debug: false,
      symbol: this.props.symbol,
      datafeed: Datafeed,
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates', 'hide_left_toolbar_by_default'],
      disabledDrawings: true,
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      time_frames:TIME_FRAMES,
      autosize: this.props.autosize,
      theme: this.props.theme,
      studies_overrides: this.props.studiesOverrides,
      overrides: {
          "mainSeriesProperties.showCountdown": false,
      },
    };
    window.TradingView.onready(() => {
      const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
      widget.onChartReady(() => {
        widget.createButton()
          .attr('title', 'Select or Search Pairings')
          .addClass('apply-common-tooltip')
          .on('click', () => widget.chart().executeActionById("symbolSearch"))[0].innerHTML = 'Pairings';
        widget.createButton()
          .attr('title', 'Dark Mode')
          .addClass('apply-common-tooltip')
          .on('click', () => widget.changeTheme("Dark"))[0].innerHTML = 'Dark';
        widget.createButton()
          .attr('title', 'Light Mode')
          .addClass('apply-common-tooltip')
          .on('click', () => widget.changeTheme("Light"))[0].innerHTML = 'Light';
      });
    });
  }

  render() {
    return (
      <div 
        id={ this.props.containerId }
        className={ 'TVChartContainer' }
      />
    );
  }
}

export default TVChartContainer


// import React, { useEffect, useRef } from 'react';
// import './index.css';
// import { widget } from '../../charting_library';

// function getLanguageFromURL() {
// 	const regex = new RegExp('[\\?&]lang=([^&#]*)');
// 	const results = regex.exec(window.location.search);
// 	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
// }

// export const TVChartContainer = () => {
// 	const chartContainerRef = useRef();

// 	const defaultProps = {
// 		symbol: 'AAPL',
// 		interval: 'D',
// 		datafeedUrl: 'https://demo_feed.tradingview.com',
// 		libraryPath: '/charting_library/',
// 		chartsStorageUrl: 'https://saveload.tradingview.com',
// 		chartsStorageApiVersion: '1.1',
// 		clientId: 'tradingview.com',
// 		userId: 'public_user_id',
// 		fullscreen: false,
// 		autosize: true,
// 		studiesOverrides: {},
// 	};

// 	useEffect(() => {
// 		const widgetOptions = {
// 			symbol: defaultProps.symbol,
// 			// BEWARE: no trailing slash is expected in feed URL
// 			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
// 			interval: defaultProps.interval,
// 			container: chartContainerRef.current,
// 			library_path: defaultProps.libraryPath,

// 			locale: getLanguageFromURL() || 'en',
// 			disabled_features: ['use_localstorage_for_settings'],
// 			enabled_features: ['study_templates'],
// 			charts_storage_url: defaultProps.chartsStorageUrl,
// 			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
// 			client_id: defaultProps.clientId,
// 			user_id: defaultProps.userId,
// 			fullscreen: defaultProps.fullscreen,
// 			autosize: defaultProps.autosize,
// 			studies_overrides: defaultProps.studiesOverrides,
// 		};

// 		const tvWidget = new widget(widgetOptions);

// 		tvWidget.onChartReady(() => {
// 			tvWidget.headerReady().then(() => {
// 				const button = tvWidget.createButton();
// 				button.setAttribute('title', 'Click to show a notification popup');
// 				button.classList.add('apply-common-tooltip');
// 				button.addEventListener('click', () => tvWidget.showNoticeDialog({
// 					title: 'Notification',
// 					body: 'TradingView Charting Library API works correctly',
// 					callback: () => {
// 						console.log('Noticed!');
// 					},
// 				}));

// 				button.innerHTML = 'Check API';
// 			});
// 		});

// 		return () => {
// 			tvWidget.remove();
// 		};
// 	});

// 	return (
// 		<div
// 			ref={chartContainerRef}
// 			className={'TVChartContainer'}
// 		/>
// 	);
// }
