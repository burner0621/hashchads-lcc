import {
    GET_TRANSATION_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    GET_ORDRER_LIST
} from "./actionType";

// common success
export const CryptoApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const CryptoApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getTransationList = () => ({
    type: GET_TRANSATION_LIST,
});

export const getOrderList = () => ({
    type: GET_ORDRER_LIST,
});
