import {
  GET_DIRECT_CONTACT,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_MESSAGES,
  GET_MESSAGES_FAIL,
  GET_MESSAGES_SUCCESS,
  GET_CHANNELS,
  ADD_MESSAGE,
  DELETE_MESSAGE,
} from "./actionType";

// common success
export const chatsApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const chatsApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getDirectContact = () => ({
  type: GET_DIRECT_CONTACT,
});

export const getChannels = () => ({
  type: GET_CHANNELS,
});

export const getMessages = roomId => ({
  type: GET_MESSAGES,
  roomId,
})

export const getMessagesSuccess = messages => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages,
})

export const getMessagesFail = error => ({
  type: GET_MESSAGES_FAIL,
  payload: error,
})

// export const getMessages = (roomId) => ({
//   type: GET_MESSAGES,
//   payload: roomId,
// });

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const deleteMessage = (message) => ({
  type: DELETE_MESSAGE,
  payload: message,
});