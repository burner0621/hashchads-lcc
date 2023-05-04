import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_APPLICATION_LIST,
} from "./actionType";

// common success
export const ApplicationApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ApplicationApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getApplicationList = () => ({
  type: GET_APPLICATION_LIST,
});
