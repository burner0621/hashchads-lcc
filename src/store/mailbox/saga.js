import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mailbox Redux States
import { GET_MAIL, DELETE_MAIL } from "./actionType";

import {
  mailApiResponseSuccess,
  mailApiResponseError,
} from "./action";

//Include Both Helper File with needed methods
import {
  getMailDetails as getMailDetailsApi,
  deleteMail as deleteMailApi,
} from "../../helpers/fakebackend_helper";

function* getMailDetails() {
  try {
    const response = yield call(getMailDetailsApi);
    yield put(mailApiResponseSuccess(GET_MAIL, response));
  } catch (error) {
    yield put(mailApiResponseError(GET_MAIL, error));
  }
}

function* deleteMail({ payload: forId }) {
  try {
    const response = yield call(deleteMailApi, forId);
    yield put(mailApiResponseSuccess(DELETE_MAIL, response));
    toast.success("Mail Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(mailApiResponseError(DELETE_MAIL, error));
    toast.error("Mail Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetMailDetails() {
  yield takeEvery(GET_MAIL, getMailDetails);
}

export function* watchDeleteMail() {
  yield takeEvery(DELETE_MAIL, deleteMail);
}

function* mailSaga() {
  yield all([
    fork(watchGetMailDetails),
    fork(watchDeleteMail)
  ]);
}

export default mailSaga;