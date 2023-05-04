import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  RESET_REGISTER_FLAG
} from "./actionTypes";

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false
};

const Account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      state = {
        ...state,
        loading: true,
        registrationError: null,
      };
      break;
    case REGISTER_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        user: action.payload,
        success: true,
        registrationError: null,

      };
      break;
    case REGISTER_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
        error: true
      };
      break;
    case RESET_REGISTER_FLAG:
      state = {
        ...state,
        success: false,
        error: false
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Account;
