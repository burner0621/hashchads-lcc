import {
    GET_TASK_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    ADD_NEW_TASK,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAIL,
    UPDATE_TASK,
    UPDATE_TASK_SUCCESS,
    UPDATE_TASK_FAIL,
    DELETE_TASK,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAIL,
} from "./actionType";

// common success
export const TaskApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const TaskApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getTaskList = () => ({
    type: GET_TASK_LIST,
});

export const updateTask = task => ({
    type: UPDATE_TASK,
    payload: task,
  });
  
  export const updateTaskSuccess = task => ({
    type: UPDATE_TASK_SUCCESS,
    payload: task,
  });
  
  export const updateTaskFail = error => ({
    type: UPDATE_TASK_FAIL,
    payload: error,
  });
  
  export const addNewTask = task => ({
    type: ADD_NEW_TASK,
    payload: task,
  });
  
  export const addTaskSuccess = task => ({
    type: ADD_TASK_SUCCESS,
    payload: task,
  });
  
  export const addTaskFail = error => ({
    type: ADD_TASK_FAIL,
    payload: error,
  });
  export const deleteTask = task => ({
    type: DELETE_TASK,
    payload: task,
  });
  
  export const deleteTaskSuccess = task => ({
    type: DELETE_TASK_SUCCESS,
    payload: task,
  });
  
  export const deleteTaskFail = error => ({
    type: DELETE_TASK_FAIL,
    payload: error,
  });