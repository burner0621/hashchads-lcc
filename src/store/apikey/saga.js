import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Application Redux States
import { GET_API_KEY } from "./actionType";
import { APIKeyResponseSuccess, APIKeyResponseError } from "./action";

//Include Both Helper File with needed methods
import { getAPIKey as getAPIKeyApi } from "../../helpers/fakebackend_helper";

function* getAPIKeys() {
  try {
    const response = yield call(getAPIKeyApi);
    yield put(APIKeyResponseSuccess(GET_API_KEY, response));
  } catch (error) {
    yield put(APIKeyResponseError(GET_API_KEY, error));
  }
}

export function* watchGetAPIKeygetAPIKey() {
  yield takeEvery(GET_API_KEY, getAPIKeys);
}

function* APIKeysaga() {
  yield all([fork(watchGetAPIKeygetAPIKey)]);
}

export default APIKeysaga;
