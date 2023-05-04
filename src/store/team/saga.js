import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crypto Redux States
import {
    GET_TEAM_DATA,
    ADD_TEAM_DATA,
    DELETE_TEAM_DATA,
    UPDATE_TEAM_DATA,
} from "./actionType";
import {
    teamApiResponseSuccess,
    teamApiResponseError,
    addTeamDataSuccess,
    addTeamDataFail,
    updateTeamDataSuccess,
    updateTeamDataFail,
    deleteTeamDataSuccess,
    deleteTeamDataFail
} from "./action";

//Include Both Helper File with needed methods
import {
    getTeamData as getTeamDataApi,
    addTeamData,
    updateTeamData,
    deleteTeamData
}
    from "../../helpers/fakebackend_helper";

function* getTeamData() {
    try {
        const response = yield call(getTeamDataApi);
        yield put(teamApiResponseSuccess(GET_TEAM_DATA, response));
    } catch (error) {
        yield put(teamApiResponseError(GET_TEAM_DATA, error));
    }
}

function* onAddTeamData({ payload: data }) {
    try {
        const response = yield call(addTeamData, data);
        yield put(addTeamDataSuccess(response));
        toast.success("Team Data Added Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(addTeamDataFail(error));
        toast.error("Team Data Added Failed", { autoClose: 3000 });
    }
}

function* onUpdateTeamData({ payload: project }) {
    try {
        const response = yield call(updateTeamData, project);
        yield put(updateTeamDataSuccess(response));
        toast.success("Team Data Updated Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(updateTeamDataFail(error));
        toast.error("Team Data Updated Failed", { autoClose: 3000 });
    }
}

function* onDeleteTeamData({ payload: data }) {
    try {
        const response = yield call(deleteTeamData, data);
        yield put(deleteTeamDataSuccess(response));
        toast.success("Team Data Delete Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(deleteTeamDataFail(error));
        toast.error("Team Data Delete Failed", { autoClose: 3000 });
    }
}

export function* watchGetTeamData() {
    yield takeEvery(GET_TEAM_DATA, getTeamData);
}

export function* watchAddTeamData() {
    yield takeEvery(ADD_TEAM_DATA, onAddTeamData);

}

export function* watchUpdateTeamData() {
    yield takeEvery(UPDATE_TEAM_DATA, onUpdateTeamData);
}

export function* watchDeleteTeamData() {
    yield takeEvery(DELETE_TEAM_DATA, onDeleteTeamData);
}

function* teamSaga() {
    yield all([
        fork(watchGetTeamData),
        fork(watchAddTeamData),
        fork(watchUpdateTeamData),
        fork(watchDeleteTeamData),
    ]);
}

export default teamSaga;
