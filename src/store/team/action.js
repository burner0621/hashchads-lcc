import {
    GET_TEAM_DATA,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    DELETE_TEAM_DATA,
    DELETE_TEAM_DATA_SUCCESS,
    DELETE_TEAM_DATA_FAIL,
    ADD_TEAM_DATA,
    ADD_TEAM_DATA_SUCCESS,
    ADD_TEAM_DATA_FAIL,
    UPDATE_TEAM_DATA,
    UPDATE_TEAM_DATA_SUCCESS,
    UPDATE_TEAM_DATA_FAIL,
} from "./actionType";

// common success
export const teamApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const teamApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getTeamData = () => ({
    type: GET_TEAM_DATA,
});

export const deleteTeamData = data => ({
    type: DELETE_TEAM_DATA,
    payload: data,
});

export const deleteTeamDataSuccess = data => ({
    type: DELETE_TEAM_DATA_SUCCESS,
    payload: data,
});

export const deleteTeamDataFail = error => ({
    type: DELETE_TEAM_DATA_FAIL,
    payload: error,
});

export const addTeamData = data => ({
    type: ADD_TEAM_DATA,
    payload: data,
});

export const addTeamDataSuccess = project => ({
    type: ADD_TEAM_DATA_SUCCESS,
    payload: project,
});

export const addTeamDataFail = error => ({
    type: ADD_TEAM_DATA_FAIL,
    payload: error,
});

export const updateTeamData = project => ({
    type: UPDATE_TEAM_DATA,
    payload: project,
});

export const updateTeamDataSuccess = project => ({
    type: UPDATE_TEAM_DATA_SUCCESS,
    payload: project,
});

export const updateTeamDataFail = error => ({
    type: UPDATE_TEAM_DATA_FAIL,
    payload: error,
});