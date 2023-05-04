import {
    GET_PROJECT_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    DELETE_PROJECT_LIST_SUCCESS,
    DELETE_PROJECT_LIST_FAIL,
    ADD_PROJECT_LIST_SUCCESS,
    ADD_PROJECT_LIST_FAIL,
    UPDATE_PROJECT_LIST_SUCCESS,
    UPDATE_PROJECT_LIST_FAIL,
} from "./actionType";

const INIT_STATE = {
    projectLists: [],
    error: {},
};

const Projects = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_PROJECT_LIST:
                    return {
                        ...state,
                        projectLists: action.payload.data,
                    };
                default:
                    return { ...state };
            }
        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_PROJECT_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                    };
                default:
                    return { ...state };
            }
        case DELETE_PROJECT_LIST_SUCCESS:
            return {
                ...state,
                projectLists: state.projectLists.filter(project => project.id.toString() !== action.payload.id.toString())
            };
        case DELETE_PROJECT_LIST_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case ADD_PROJECT_LIST_SUCCESS:
            return {
                ...state,
                projectLists: [...state.projectLists, action.payload],
            };
        case ADD_PROJECT_LIST_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        case UPDATE_PROJECT_LIST_SUCCESS:
            return {
                ...state,
                projectLists: state.projectLists.map(project =>
                    project._id.toString() === action.payload.data._id.toString()
                        ? { ...project, ...action.payload.data }
                        : project
                ),
            };
        case UPDATE_PROJECT_LIST_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return { ...state };

    }
};

export default Projects;