import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_PORTFOLIO_CHARTS_DATA,
  GET_MARKET_CHARTS_DATA
} from "./actionType";

// common success
export const dashboardCryptoApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardCryptoApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Portfolio
export const getPortfolioChartsData = (portfolioData) => ({
  type: GET_PORTFOLIO_CHARTS_DATA,
  payload: portfolioData
});

// Market Graph
export const getMarketChartsData = (marketData) => ({
  type: GET_MARKET_CHARTS_DATA,
  payload: marketData
});