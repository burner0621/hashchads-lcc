import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_PROJECT_CHARTS_DATA,
  GET_PROJECTSTATUS_CHARTS_DATA
} from "./actionType";

// common success
export const dashboardProjectApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardProjectApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Project Overview
export const getProjectChartsData = (projectData) => ({
  type: GET_PROJECT_CHARTS_DATA,
  payload: projectData
});

// Project Status
export const getProjectStatusChartsData = (projectStatusData) => ({
  type: GET_PROJECTSTATUS_CHARTS_DATA,
  payload: projectStatusData
});