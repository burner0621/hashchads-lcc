import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
    GET_TRANSATION_LIST,
    GET_ORDRER_LIST
} from "./actionType";
import { CryptoApiResponseSuccess, CryptoApiResponseError } from "./action";

//Include Both Helper File with needed methods
import {
    getTransationList as getTransationListApi,
    getOrderList as getOrderListApi
}
    from "../../helpers/fakebackend_helper";

function* getTransationList() {
    try {
        const response = yield call(getTransationListApi);
        yield put(CryptoApiResponseSuccess(GET_TRANSATION_LIST, response));
    } catch (error) {
        yield put(CryptoApiResponseError(GET_TRANSATION_LIST, error));
    }
}

function* getOrderList() {
    try {
        const response = yield call(getOrderListApi);
        yield put(CryptoApiResponseSuccess(GET_ORDRER_LIST, response));
    } catch (error) {
        yield put(CryptoApiResponseError(GET_ORDRER_LIST, error));
    }
}

export function* watchGetTransationList() {
    yield takeEvery(GET_TRANSATION_LIST, getTransationList);
}
export function* watchGetOrderList() {
    yield takeEvery(GET_ORDRER_LIST, getOrderList);
}

function* cryptoSaga() {
    yield all([
        fork(watchGetTransationList),
        fork(watchGetOrderList)
    ]);
}

export default cryptoSaga;
