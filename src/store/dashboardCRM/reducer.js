import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_BALANCEOVERVIEW_CHARTS_DATA,
  GET_DIALTYPE_CHARTS_DATA,
  GET_SALESFORECAST_CHARTS_DATA,
} from "./actionType";

const INIT_STATE = {
  balanceOverviewData: [],
  dialTypeData: [],
  salesForecastData: [],
  error: {}
};

const DashboardCRM = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_BALANCEOVERVIEW_CHARTS_DATA:
          return {
            ...state,
            balanceOverviewData: action.payload.data
          };
        case GET_DIALTYPE_CHARTS_DATA:
          return {
            ...state,
            dialTypeData: action.payload.data
          };
        case GET_SALESFORECAST_CHARTS_DATA:
          return {
            ...state,
            salesForecastData: action.payload.data
          };

        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_BALANCEOVERVIEW_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_DIALTYPE_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_SALESFORECAST_CHARTS_DATA:
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
export default DashboardCRM;