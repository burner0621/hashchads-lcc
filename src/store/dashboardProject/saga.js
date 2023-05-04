import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_PROJECT_CHARTS_DATA, GET_PROJECTSTATUS_CHARTS_DATA } from "./actionType";
import { dashboardProjectApiSuccess, dashboardProjectApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getAllProjectData,
  getMonthProjectData,
  gethalfYearProjectData,
  getYearProjectData,
  getAllProjectStatusData,
  getWeekProjectStatusData,
  getMonthProjectStatusData,
  getQuarterProjectStatusData
}
  from "../../helpers/fakebackend_helper";

function* getProjectChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllProjectData, data);
    }
    if (data === "month") {
      response = yield call(getMonthProjectData, data);
    }
    if (data === "halfyear") {
      response = yield call(gethalfYearProjectData, data);
    }
    if (data === "year") {
      response = yield call(getYearProjectData, data);
    }
    yield put(dashboardProjectApiSuccess(GET_PROJECT_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardProjectApiError(GET_PROJECT_CHARTS_DATA, error));
  }
}

function* getProjectStatusChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllProjectStatusData, data);
    }
    if (data === "week") {
      response = yield call(getWeekProjectStatusData, data);
    }
    if (data === "month") {
      response = yield call(getMonthProjectStatusData, data);
    }
    if (data === "quarter") {
      response = yield call(getQuarterProjectStatusData, data);
    }
    yield put(dashboardProjectApiSuccess(GET_PROJECTSTATUS_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardProjectApiError(GET_PROJECTSTATUS_CHARTS_DATA, error));
  }
}


export function* watchGetProjectChartsData() {
  yield takeEvery(GET_PROJECT_CHARTS_DATA, getProjectChartsData);
}

export function* watchGetProjectStatusChartsData() {
  yield takeEvery(GET_PROJECTSTATUS_CHARTS_DATA, getProjectStatusChartsData);
}

function* dashboardProjectSaga() {
  yield all([fork(watchGetProjectChartsData)]);
  yield all([fork(watchGetProjectStatusChartsData)]);
}

export default dashboardProjectSaga;
