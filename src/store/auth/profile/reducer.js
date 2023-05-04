import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG } from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  user: {}
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        success: action.payload.status,
        user: action.payload.data
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        error: action.payload
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
