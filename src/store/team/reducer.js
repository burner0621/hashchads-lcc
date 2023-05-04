import {
    GET_TEAM_DATA,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    DELETE_TEAM_DATA_SUCCESS,
    DELETE_TEAM_DATA_FAIL,
    ADD_TEAM_DATA_SUCCESS,
    ADD_TEAM_DATA_FAIL,
    UPDATE_TEAM_DATA_SUCCESS,
    UPDATE_TEAM_DATA_FAIL,
} from "./actionType";

const INIT_STATE = {
    teamData: [],
    error: {},
};

const Team = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_TEAM_DATA:
                    return {
                        ...state,
                        teamData: action.payload.data,
                    };
                default:
                    return { ...state };
            }
        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TEAM_DATA:
                    return {
                        ...state,
                        error: action.payload.error,
                    };
                default:
                    return { ...state };
            }
        case DELETE_TEAM_DATA_SUCCESS:
            return {
                ...state,
                teamData: state.teamData.filter(team => team.id.toString() !== action.payload.id.toString())
            };
        case DELETE_TEAM_DATA_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case ADD_TEAM_DATA_SUCCESS:
            return {
                ...state,
                teamData: [...state.teamData, action.payload],
            };
        case ADD_TEAM_DATA_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        case UPDATE_TEAM_DATA_SUCCESS:
            return {
                ...state,
                teamData: state.teamData.map(team =>
                    team.id.toString() === action.payload.id.toString()
                        ? { ...team, ...action.payload }
                        : team
                ),
            };
        case UPDATE_TEAM_DATA_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return { ...state };

    }
};

export default Team;