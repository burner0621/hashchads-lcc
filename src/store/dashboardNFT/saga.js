import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_MARKETPLACE_CHARTS_DATA } from "./actionType";
import { dashboardNFTApiSuccess, dashboardNFTApiError } from "./action";

//Include Both Helper File with needed methods
import {
  getAllMarketplaceData,
  getMonthMarketplaceData,
  gethalfYearMarketplaceData,
  getYearMarketplaceData
}
  from "../../helpers/fakebackend_helper";

function* getMarketChartsData({ payload: data }) {
  try {
    var response;
    if (data === "all") {
      response = yield call(getAllMarketplaceData, data);
    }
    if (data === "month") {
      response = yield call(getMonthMarketplaceData, data);
    }
    if (data === "halfyear") {
      response = yield call(gethalfYearMarketplaceData, data);
    }
    if (data === "year") {
      response = yield call(getYearMarketplaceData, data);
    }
    yield put(dashboardNFTApiSuccess(GET_MARKETPLACE_CHARTS_DATA, response));
  } catch (error) {
    yield put(dashboardNFTApiError(GET_MARKETPLACE_CHARTS_DATA, error));
  }
}

export function* watchGetMarketChartsData() {
  yield takeEvery(GET_MARKETPLACE_CHARTS_DATA, getMarketChartsData);
}

function* dashboardNFTSaga() {
  yield all([fork(watchGetMarketChartsData)]);
}

export default dashboardNFTSaga;
