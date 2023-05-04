import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_REVENUE_CHARTS_DATA } from "./actionType";
import { dashboardEcommerceApiSuccess, dashboardEcommerceApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getAllRevenueData,
  getMonthRevenueData,
  getHalfYearRevenueData,
  getYearRevenueData
}
  from "../../helpers/fakebackend_helper";

function* getRevenueChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllRevenueData, data);
    }
    if (data === "month") {
      response = yield call(getMonthRevenueData, data);
    }
    if (data === "halfyear") {
      response = yield call(getHalfYearRevenueData, data);
    }
    if (data === "year") {
      response = yield call(getYearRevenueData, data);
    }
    yield put(dashboardEcommerceApiSuccess(GET_REVENUE_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardEcommerceApiError(GET_REVENUE_CHARTS_DATA, error));
  }
}

export function* watchGetRevenueChartsData() {
  yield takeEvery(GET_REVENUE_CHARTS_DATA, getRevenueChartsData);
}

function* dashboardEcommerceSaga() {
  yield all([fork(watchGetRevenueChartsData)]);
}

export default dashboardEcommerceSaga;
