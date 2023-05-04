import {
    GET_PROJECT_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    DELETE_PROJECT_LIST,
    DELETE_PROJECT_LIST_SUCCESS,
    DELETE_PROJECT_LIST_FAIL,
    ADD_PROJECT_LIST,
    ADD_PROJECT_LIST_SUCCESS,
    ADD_PROJECT_LIST_FAIL,
    UPDATE_PROJECT_LIST,
    UPDATE_PROJECT_LIST_SUCCESS,
    UPDATE_PROJECT_LIST_FAIL,
} from "./actionType";

// common success
export const projectApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const projectApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getProjectList = () => ({
    type: GET_PROJECT_LIST,
});

export const deleteProjectList = data => ({
    type: DELETE_PROJECT_LIST,
    payload: data,
});

export const deleteProjectListSuccess = data => ({
    type: DELETE_PROJECT_LIST_SUCCESS,
    payload: data,
});

export const deleteProjectListFail = error => ({
    type: DELETE_PROJECT_LIST_FAIL,
    payload: error,
});

export const addProjectList = data => ({
    type: ADD_PROJECT_LIST,
    payload: data,
});

export const addProjectListSuccess = project => ({
    type: ADD_PROJECT_LIST_SUCCESS,
    payload: project,
});

export const addProjectListFail = error => ({
    type: ADD_PROJECT_LIST_FAIL,
    payload: error,
});

export const updateProjectList = project => ({
    type: UPDATE_PROJECT_LIST,
    payload: project,
});

export const updateProjectListSuccess = project => ({
    type: UPDATE_PROJECT_LIST_SUCCESS,
    payload: project,
});

export const updateProjectListFail = error => ({
    type: UPDATE_PROJECT_LIST_FAIL,
    payload: error,
});