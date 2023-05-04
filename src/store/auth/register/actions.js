import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  RESET_REGISTER_FLAG
} from "./actionTypes"

export const registerUser = user => {
  return {
    type: REGISTER_USER,
    payload: { user },
  }
}

export const registerUserSuccessful = user => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  }
}

export const registerUserFailed = user => {
  return {
    type: REGISTER_USER_FAILED,
    payload: user,
  }
}

export const resetRegisterFlag = () => {
  return {
    type: RESET_REGISTER_FLAG,
  }
}

