import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Application Redux States
import { GET_APPLICATION_LIST } from "./actionType";
import {
  ApplicationApiResponseSuccess,
  ApplicationApiResponseError,
} from "./action";

//Include Both Helper File with needed methods
import { getJobApplicationList as getApplicationListApi } from "../../helpers/fakebackend_helper";

function* getApplicationList() {
  try {
    const response = yield call(getApplicationListApi);

    yield put(ApplicationApiResponseSuccess(GET_APPLICATION_LIST, response));
  } catch (error) {
    yield put(ApplicationApiResponseError(GET_APPLICATION_LIST, error));
  }
}

export function* watchGetApplicationList() {
  yield takeEvery(GET_APPLICATION_LIST, getApplicationList);
}

function* ApplicationSaga() {
  yield all([fork(watchGetApplicationList)]);
}

export default ApplicationSaga;
