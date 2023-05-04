import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_PORTFOLIO_CHARTS_DATA,
  GET_MARKET_CHARTS_DATA
} from "./actionType";

const INIT_STATE = {
  portfolioData: [],
  marketData:[],
  error: {}
};

const DashboardCrypto = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_PORTFOLIO_CHARTS_DATA:
          return {
            ...state,
            portfolioData: action.payload.data
          };
        case GET_MARKET_CHARTS_DATA:
          return {
            ...state,
            marketData: action.payload.data
          };
        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_PORTFOLIO_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_MARKET_CHARTS_DATA:
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
export default DashboardCrypto;