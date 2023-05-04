import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_COUNTRY_CHARTS_DATA,
  GET_AUDIENCESMETRICS_CHARTS_DATA,
  GET_USERDEVICE_CHARTS_DATA,
  GET_AUDIENCESSESSIONS_CHARTS_DATA
} from "./actionType";

const INIT_STATE = {
  chartData: [],
  audiencesMetricsData: [],
  userDeviceData: [],
  audiencesSessionsData:[],
  error: {}
};

const DashboardAnalytics = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_COUNTRY_CHARTS_DATA:
          return {
            ...state,
            chartData: action.payload.data
          };
        case GET_AUDIENCESMETRICS_CHARTS_DATA:
          return {
            ...state,
            audiencesMetricsData: action.payload.data
          };
        case GET_USERDEVICE_CHARTS_DATA:
          return {
            ...state,
            userDeviceData: action.payload.data
          };
          case GET_AUDIENCESSESSIONS_CHARTS_DATA:
          return {
            ...state,
            audiencesSessionsData: action.payload.data
          };
        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_COUNTRY_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_AUDIENCESMETRICS_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_USERDEVICE_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
          case GET_AUDIENCESSESSIONS_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        default:
          return state;
      }
    default:
      return state;
  }
};
export default DashboardAnalytics;