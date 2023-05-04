import {
    GET_TRANSATION_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    GET_ORDRER_LIST
} from "./actionType";

const INIT_STATE = {
    transationList: [],
    orderList: [],
};

const Crypto = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_TRANSATION_LIST:
                    return {
                        ...state,
                        transationList: action.payload.data,
                    };

                case GET_ORDRER_LIST:
                    return {
                        ...state,
                        orderList: action.payload.data,
                    };
                default:
                    return { ...state };
            }

        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TRANSATION_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                    };

                case GET_ORDRER_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                    };

                default:
                    return { ...state };
            }

        case GET_TRANSATION_LIST: {
            return {
                ...state,
            };
        }

        case GET_ORDRER_LIST: {
            return {
                ...state,
            };
        }

        default:
            return { ...state };
    }
};

export default Crypto;