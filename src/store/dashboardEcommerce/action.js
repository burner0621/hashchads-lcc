import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_REVENUE_CHARTS_DATA,
} from "./actionType";

// common success
export const dashboardEcommerceApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardEcommerceApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// revenue
export const getRevenueChartsData = (revenueData) => ({
  type: GET_REVENUE_CHARTS_DATA,
  payload: revenueData
});