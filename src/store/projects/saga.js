import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crypto Redux States
import {
    GET_PROJECT_LIST,
    ADD_PROJECT_LIST,
    DELETE_PROJECT_LIST,
    UPDATE_PROJECT_LIST,
} from "./actionType";
import {
    projectApiResponseSuccess,
    projectApiResponseError,
    addProjectListSuccess,
    addProjectListFail,
    updateProjectListSuccess,
    updateProjectListFail,
    deleteProjectListSuccess,
    deleteProjectListFail
} from "./action";

//Include Both Helper File with needed methods
import {
    getProjectList as getProjectListApi,
    addProjectList,
    updateProjectList,
    deleteProjectList
}
    from "../../helpers/fakebackend_helper";

function* getProjectList() {
    try {
        const response = yield call(getProjectListApi);
        yield put(projectApiResponseSuccess(GET_PROJECT_LIST, response));
    } catch (error) {
        yield put(projectApiResponseError(GET_PROJECT_LIST, error));
    }
}

function* onAddProjectList({ payload: data }) {
    try {
        const response = yield call(addProjectList, data);
        yield put(addProjectListSuccess(response));
        toast.success("project-list Added Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(addProjectListFail(error));
        toast.error("project-list Added Failed", { autoClose: 3000 });
    }
}

function* onUpdateProjectList({ payload: project }) {
    try {
        const response = yield call(updateProjectList, project);
        yield put(updateProjectListSuccess(response));
        toast.success("project-list Updated Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(updateProjectListFail(error));
        toast.error("project-list Updated Failed", { autoClose: 3000 });
    }
}

function* onDeleteProjectList({ payload: data }) {
    try {
        const response = yield call(deleteProjectList, data);
        yield put(deleteProjectListSuccess(response));
        toast.success("project-list Delete Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(deleteProjectListFail(error));
        toast.error("project-list Delete Failed", { autoClose: 3000 });
    }
}

export function* watchGetProjectList() {
    yield takeEvery(GET_PROJECT_LIST, getProjectList);
}

export function* watchAddProjectList() {
    yield takeEvery(ADD_PROJECT_LIST, onAddProjectList);

}

export function* watchUpdateProjectList() {
    yield takeEvery(UPDATE_PROJECT_LIST, onUpdateProjectList);
}

export function* watchDeleteProjectList() {
    yield takeEvery(DELETE_PROJECT_LIST, onDeleteProjectList);
}

function* projectSaga() {
    yield all([
        fork(watchGetProjectList),
        fork(watchAddProjectList),
        fork(watchUpdateProjectList),
        fork(watchDeleteProjectList),
    ]);
}

export default projectSaga;
