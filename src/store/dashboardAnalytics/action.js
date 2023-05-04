import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_COUNTRY_CHARTS_DATA,
  GET_AUDIENCESMETRICS_CHARTS_DATA,
  GET_USERDEVICE_CHARTS_DATA,
  GET_AUDIENCESSESSIONS_CHARTS_DATA
} from "./actionType";

// common success
export const dashboardAnalyticsApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardAnalyticsApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// charts data
export const getCountryChartsData = (chartData) => ({
  type: GET_COUNTRY_CHARTS_DATA,
  payload: chartData
});

// Audiences Metrics
export const getAudiencesMetricsChartsData = (audiencesMetricsData) => ({
  type: GET_AUDIENCESMETRICS_CHARTS_DATA,
  payload: audiencesMetricsData
});

// Users by Device
export const getUserDeviceChartsData = (userDeviceData) => ({
  type: GET_USERDEVICE_CHARTS_DATA,
  payload: userDeviceData
});

// Audiences Sessions by Country
export const getAudiencesSessionsChartsData = (audiencesSessionsData) => ({
  type: GET_AUDIENCESSESSIONS_CHARTS_DATA,
  payload: audiencesSessionsData
});
