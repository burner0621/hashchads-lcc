import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_COUNTRY_CHARTS_DATA, GET_AUDIENCESMETRICS_CHARTS_DATA, GET_USERDEVICE_CHARTS_DATA, GET_AUDIENCESSESSIONS_CHARTS_DATA } from "./actionType";
import { dashboardAnalyticsApiSuccess, dashboardAnalyticsApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getAllData,
  getHalfYearlyData,
  getMonthlyData,
  getAllAudiencesMetricsData,
  getMonthlyAudiencesMetricsData,
  getHalfYearlyAudiencesMetricsData,
  getYearlyAudiencesMetricsData,
  getTodayDeviceData,
  getLastWeekDeviceData,
  getLastMonthDeviceData,
  getCurrentYearDeviceData,
  getTodaySessionData,
  getLastWeekSessionData,
  getLastMonthSessionData,
  getCurrentYearSessionData
}
  from "../../helpers/fakebackend_helper";

function* getChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllData, data);
    }
    if (data === "halfyearly") {
      response = yield call(getHalfYearlyData, data);
    }
    if (data === "monthly") {
      response = yield call(getMonthlyData, data);
    }

    yield put(dashboardAnalyticsApiSuccess(GET_COUNTRY_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardAnalyticsApiError(GET_COUNTRY_CHARTS_DATA, error));
  }
}

function* getAudiencesMetricsChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllAudiencesMetricsData, data);
    }
    if (data === "monthly") {
      response = yield call(getMonthlyAudiencesMetricsData, data);
    }
    if (data === "halfyearly") {
      response = yield call(getHalfYearlyAudiencesMetricsData, data);
    }
    if (data === "yearly") {
      response = yield call(getYearlyAudiencesMetricsData, data);
    }

    yield put(dashboardAnalyticsApiSuccess(GET_AUDIENCESMETRICS_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardAnalyticsApiError(GET_AUDIENCESMETRICS_CHARTS_DATA, error));
  }
}

function* getUserDeviceChartsData({ payload: data }) {
  try {
    var response;
    if (data === "today") {
      response = yield call(getTodayDeviceData, data);
    }
    if (data === "lastWeek") {
      response = yield call(getLastWeekDeviceData, data);
    }
    if (data === "lastMonth") {
      response = yield call(getLastMonthDeviceData, data);
    }
    if (data === "currentYear") {
      response = yield call(getCurrentYearDeviceData, data);
    }

    yield put(dashboardAnalyticsApiSuccess(GET_USERDEVICE_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardAnalyticsApiError(GET_USERDEVICE_CHARTS_DATA, error));
  }
}
function* getAudiencesSessionsChartsData({ payload: data }) {
  try {
    var response;
    if (data === "today") {
      response = yield call(getTodaySessionData, data);
    }
    if (data === "lastWeek") {
      response = yield call(getLastWeekSessionData, data);
    }
    if (data === "lastMonth") {
      response = yield call(getLastMonthSessionData, data);
    }
    if (data === "currentYear") {
      response = yield call(getCurrentYearSessionData, data);
    }

    yield put(dashboardAnalyticsApiSuccess(GET_AUDIENCESSESSIONS_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardAnalyticsApiError(GET_AUDIENCESSESSIONS_CHARTS_DATA, error));
  }
}

export function* watchGetChartsData() {
  yield takeEvery(GET_COUNTRY_CHARTS_DATA, getChartsData);
}

export function* watchGetAudiencesMetricsChartsData() {
  yield takeEvery(GET_AUDIENCESMETRICS_CHARTS_DATA, getAudiencesMetricsChartsData);
}

export function* watchGetUserDeviceChartsData() {
  yield takeEvery(GET_USERDEVICE_CHARTS_DATA, getUserDeviceChartsData);
}

export function* watchGetAudiencesSessionsChartsData() {
  yield takeEvery(GET_AUDIENCESSESSIONS_CHARTS_DATA, getAudiencesSessionsChartsData);
}

function* dashboardAnalyticsSaga() {
  yield all([fork(watchGetChartsData)]);
  yield all([fork(watchGetAudiencesMetricsChartsData)]);
  yield all([fork(watchGetUserDeviceChartsData)]);
  yield all([fork(watchGetAudiencesSessionsChartsData)]);
}

export default dashboardAnalyticsSaga;
