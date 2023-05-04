import {
    GET_TASK_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAIL,
    UPDATE_TASK_SUCCESS,
    UPDATE_TASK_FAIL,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAIL,
} from "./actionType";

const INIT_STATE = {
    taskList: [],
};

const Tasks = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_TASK_LIST:
                    return {
                        ...state,
                        taskList: action.payload.data,
                        isTaskCreated: false,
                        isTaskSuccess: true
                    };

                default:
                    return { ...state };
            }

        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TASK_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                        isTaskCreated: false,
                        isTaskSuccess: true
                    };

                default:
                    return { ...state };
            }

        case GET_TASK_LIST: {
            return {
                ...state,
                isTaskCreated: false
            };
        }

        case ADD_TASK_SUCCESS:
            return {
                ...state,
                isTaskCreated: true,
                taskList: [...state.taskList, action.payload.data],
                isTaskAdd: true,
                isTaskAddFail: false,
            };

        case ADD_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
                isTaskAdd: false,
                isTaskAddFail: true,
            };

        case UPDATE_TASK_SUCCESS:
            return {
                ...state,
                taskList: state.taskList.map(task =>
                    task._id.toString() === action.payload.data._id.toString()
                        ? { ...task, ...action.payload.data }
                        : task
                ),
                isTaskUpdate: true,
                isTaskUpdateFail: false
            };

        case UPDATE_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
                isTaskUpdate: false,
                isTaskUpdateFail: true
            };

        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                taskList: state.taskList.filter(
                    task => task._id.toString() !== action.payload.task.toString()
                ),
                isTaskDelete: true,
                isTaskDeleteFail: false
            };

        case DELETE_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
                isTaskDelete: false,
                isTaskDeleteFail: true
            };

        default:
            return { ...state };
    }
};

export default Tasks;