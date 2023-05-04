import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DIRECT_CONTACT,
  GET_MESSAGES,
  GET_CHANNELS,
  ADD_MESSAGE,
  DELETE_MESSAGE,
} from "./actionType";

import {
  chatsApiResponseSuccess,
  chatsApiResponseError,
  getMessagesFail,
  getMessagesSuccess,
} from "./action";

//Include Both Helper File with needed methods
import {
  getDirectContact as getDirectContactApi,
  getMessages as getMessagesApi,
  getChannels as getChannelsApi,
  addMessage as addMessageApi,
  deleteMessage as deleteMessageApi,
} from "../../helpers/fakebackend_helper";

function* getDirectContact() {
  try {
    const response = yield call(getDirectContactApi);
    yield put(chatsApiResponseSuccess(GET_DIRECT_CONTACT, response));
  } catch (error) {
    yield put(chatsApiResponseError(GET_DIRECT_CONTACT, error));
  }
}

function* getChannels() {
  try {
    const response = yield call(getChannelsApi);
    yield put(chatsApiResponseSuccess(GET_CHANNELS, response));
  } catch (error) {
    yield put(chatsApiResponseError(GET_CHANNELS, error));
  }
}

function* getMessages({ roomId }) {
  try {
    const response = yield call(getMessagesApi, roomId);
    yield put(getMessagesSuccess(response));
  } catch (error) {
    yield put(getMessagesFail(error));
  }
}

function* addMessage({ payload: message }) {
  try {
    const response = yield call(addMessageApi, message);
    yield put(chatsApiResponseSuccess(ADD_MESSAGE, response));
  } catch (error) {
    yield put(chatsApiResponseError(ADD_MESSAGE, error));
  }
}

function* deleteMessage({ payload: message }) {
  try {
    const response = yield call(deleteMessageApi, message);
    yield put(chatsApiResponseSuccess(DELETE_MESSAGE, response));
  } catch (error) {
    yield put(chatsApiResponseError(DELETE_MESSAGE, error));
  }
}

export function* watchGetDirectContact() {
  yield takeEvery(GET_DIRECT_CONTACT, getDirectContact);
}
export function* watchOnGetMessages() {
  yield takeEvery(GET_MESSAGES, getMessages);
}
export function* watchOnGetChannels() {
  yield takeEvery(GET_CHANNELS, getChannels);
}
export function* watchOnAddMessage() {
  yield takeEvery(ADD_MESSAGE, addMessage);
}
export function* watchOnDeleteMessage() {
  yield takeEvery(DELETE_MESSAGE, deleteMessage);
}

function* chatSaga() {
  yield all([
    fork(watchGetDirectContact),
    fork(watchOnGetChannels),
    fork(watchOnGetMessages),
    fork(watchOnAddMessage),
    fork(watchOnDeleteMessage),
  ]);
}

export default chatSaga;
