import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_REVENUE_CHARTS_DATA,
} from "./actionType";

const INIT_STATE = {
  revenueData: [],
  error: {}
};

const DashboardEcommerce = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_REVENUE_CHARTS_DATA:
          return {
            ...state,
            revenueData: action.payload.data
          };
        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_REVENUE_CHARTS_DATA:
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
export default DashboardEcommerce;