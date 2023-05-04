import {
  API_KEY_RESPONSE_SUCCESS,
  API_KEY_RESPONSE_ERROR,
  GET_API_KEY,
} from "./actionType";

// common success
export const APIKeyResponseSuccess = (actionType, data) => ({
  type: API_KEY_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const APIKeyResponseError = (actionType, error) => ({
  type: API_KEY_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAPIKey = () => ({
  type: GET_API_KEY,
});
