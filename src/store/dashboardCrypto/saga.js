import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_PORTFOLIO_CHARTS_DATA, GET_MARKET_CHARTS_DATA } from "./actionType";
import { dashboardCryptoApiSuccess, dashboardCryptoApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getBtcPortfolioData,
  getUsdPortfolioData,
  getEuroPortfolioData,
  getAllMarketData,
  getYearMarketData,
  getMonthMarketData,
  getWeekMarketData,
  getHourMarketData
}
  from "../../helpers/fakebackend_helper";

function* getPortfolioChartsData({ payload: data }) {
  try {
    var response;
    if (data === "btc") {
      response = yield call(getBtcPortfolioData, data);
    }
    if (data === "usd") {
      response = yield call(getUsdPortfolioData, data);
    }
    if (data === "euro") {
      response = yield call(getEuroPortfolioData, data);
    }
    yield put(dashboardCryptoApiSuccess(GET_PORTFOLIO_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardCryptoApiError(GET_PORTFOLIO_CHARTS_DATA, error));
  }
}

function* getMarketChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllMarketData, data);
    }
    if (data === "year") {
      response = yield call(getYearMarketData, data);
    }
    if (data === "month") {
      response = yield call(getMonthMarketData, data);
    }
    if (data === "week") {
      response = yield call(getWeekMarketData, data);
    }
    if (data === "hour") {
      response = yield call(getHourMarketData, data);
    }
    yield put(dashboardCryptoApiSuccess(GET_MARKET_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardCryptoApiError(GET_MARKET_CHARTS_DATA, error));
  }
}

export function* watchGetPortfolioChartsData() {
  yield takeEvery(GET_PORTFOLIO_CHARTS_DATA, getPortfolioChartsData);
}

export function* watchGetMarketChartsData() {
  yield takeEvery(GET_MARKET_CHARTS_DATA, getMarketChartsData);
}

function* dashboardCryptoSaga() {
  yield all([fork(watchGetPortfolioChartsData)]);
  yield all([fork(watchGetMarketChartsData)]);
}

export default dashboardCryptoSaga;
