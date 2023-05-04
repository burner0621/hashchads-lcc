import {
  GET_MAIL,
  DELETE_MAIL,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

const INIT_STATE = {
  mailDetails: [],
  error: {},
};

const MailBox = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_MAIL:
          return {
            ...state,
            mailDetails: action.payload.data,
            isLoader: false
          };

        case DELETE_MAIL:
          return {
            ...state,
            mailDetails: state.mailDetails.filter(
              mail => mail.forId.toString() !== action.payload.data.toString()
            ),
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_MAIL:
          return {
            ...state,
            error: action.payload.error,
            isLoader: true
          };

        case DELETE_MAIL:
          return {
            ...state,
            error: action.payload.error,
            isMailDetailsDeleted: false
          };
        default:
          return { ...state };
      }
    case GET_MAIL:
      return {
        ...state,
        getLanguagesLoading: false,
        isMailDetailsDeleted: false,
        isLoader: true

      };

    case DELETE_MAIL:
      return {
        ...state,
        isMailDetailsDeleted: false
      };
    default:
      return { ...state };
  }
};

export default MailBox;