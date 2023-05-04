import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_BALANCEOVERVIEW_CHARTS_DATA, GET_DIALTYPE_CHARTS_DATA, GET_SALESFORECAST_CHARTS_DATA } from "./actionType";
import { dashboardCrmApiSuccess, dashboardCrmApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getTodayBalanceData,
  getLastWeekBalanceData,
  getLastMonthBalanceData,
  getCurrentYearBalanceData,
  getTodayDealData,
  getWeeklyDealData,
  getMonthlyDealData,
  getYearlyDealData,
  getOctSalesData,
  getNovSalesData,
  getDecSalesData,
  getJanSalesData
}
  from "../../helpers/fakebackend_helper";

function* getBalanceChartsData({ payload: data }) {
  try {
    var response;
    if (data === "today") {
      response = yield call(getTodayBalanceData, data);
    }
    if (data === "lastWeek") {
      response = yield call(getLastWeekBalanceData, data);
    }
    if (data === "lastMonth") {
      response = yield call(getLastMonthBalanceData, data);
    }
    if (data === "currentYear") {
      response = yield call(getCurrentYearBalanceData, data);
    }

    yield put(dashboardCrmApiSuccess(GET_BALANCEOVERVIEW_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardCrmApiError(GET_BALANCEOVERVIEW_CHARTS_DATA, error));
  }
}

function* getDialChartsData({ payload: data }) {
  try {
    var response;
    if (data === "today") {
      response = yield call(getTodayDealData, data);
    }
    if (data === "weekly") {
      response = yield call(getWeeklyDealData, data);
    }
    if (data === "monthly") {
      response = yield call(getMonthlyDealData, data);
    }
    if (data === "yearly") {
      response = yield call(getYearlyDealData, data);
    }

    yield put(dashboardCrmApiSuccess(GET_DIALTYPE_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardCrmApiError(GET_DIALTYPE_CHARTS_DATA, error));
  }
}

function* getSalesChartsData({ payload: data }) {
  try {
    var response;
    if (data === "oct") {
      response = yield call(getOctSalesData, data);
    }
    if (data === "nov") {
      response = yield call(getNovSalesData, data);
    }
    if (data === "dec") {
      response = yield call(getDecSalesData, data);
    }
    if (data === "jan") {
      response = yield call(getJanSalesData, data);
    }

    yield put(dashboardCrmApiSuccess(GET_SALESFORECAST_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardCrmApiError(GET_SALESFORECAST_CHARTS_DATA, error));
  }
}

export function* watchGetBalanceChartsData() {
  yield takeEvery(GET_BALANCEOVERVIEW_CHARTS_DATA, getBalanceChartsData);
}

export function* watchGetDialChartsData() {
  yield takeEvery(GET_DIALTYPE_CHARTS_DATA, getDialChartsData);
}

export function* watchGetSalesChartsData() {
  yield takeEvery(GET_SALESFORECAST_CHARTS_DATA, getSalesChartsData);
}

function* dashboardCrmSaga() {
  yield all([fork(watchGetBalanceChartsData)]);
  yield all([fork(watchGetDialChartsData)]);
  yield all([fork(watchGetSalesChartsData)]);
}

export default dashboardCrmSaga;
