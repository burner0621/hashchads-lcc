import { put, takeEvery, all, delay } from "redux-saga/effects";
import {INCREMENT, DECREMENT} from './actionType';
import {increment, decrement } from './action';

function* incrementAsync() {
    yield put({ type: INCREMENT });
    yield delay(1000);
    yield put({ type: DECREMENT });
    yield delay(1000);
    yield put({ type: INCREMENT });
    yield delay(1000);
    yield put({ type: DECREMENT });
 }

 function* watchIncrementAsync() {
    yield takeEvery(incrementAsync);
 }

 export function* CounterSaga() {
    yield all([watchIncrementAsync()]);
 }