import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_MARKETPLACE_CHARTS_DATA,
} from "./actionType";

// common success
export const dashboardNFTApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardNFTApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// marketplace
export const getMarketplaceChartsData = (marketplaceData) => ({
  type: GET_MARKETPLACE_CHARTS_DATA,
  payload: marketplaceData
});