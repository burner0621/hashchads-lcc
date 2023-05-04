import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_PROJECT_CHARTS_DATA,
  GET_PROJECTSTATUS_CHARTS_DATA
} from "./actionType";

const INIT_STATE = {
  projectData: [],
  projectStatusData: [],
  error: {}
};

const DashboardProject = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_PROJECT_CHARTS_DATA:
          return {
            ...state,
            projectData: action.payload.data
          };
        case GET_PROJECTSTATUS_CHARTS_DATA:
          return {
            ...state,
            projectStatusData: action.payload.data
          };
        default:
          return state;
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_PROJECT_CHARTS_DATA:
          return {
            ...state,
            error: action.payload.error
          };
        case GET_PROJECTSTATUS_CHARTS_DATA:
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
export default DashboardProject;