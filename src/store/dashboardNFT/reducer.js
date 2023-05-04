import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_MARKETPLACE_CHARTS_DATA,
} from "./actionType";

const INIT_STATE = {
  marketplaceData: [],
  error: {}
};

const DashboardNFT = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_MARKETPLACE_CHARTS_DATA:
          return {
            ...state,
            marketplaceData: action.payload.data
          };
        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_MARKETPLACE_CHARTS_DATA:
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
export default DashboardNFT;