import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_TODOS,
  UPDATE_TODO,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_FAIL,
  ADD_NEW_TODO,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAIL,
  DELETE_TODO,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_FAIL,
  GET_PROJECTS,
  ADD_NEW_PROJECT,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL
} from "./actionType";

// common success
export const toDoApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const toDoApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getTodos = () => ({
  type: GET_TODOS,
});

export const updateTodo = todo => ({
  type: UPDATE_TODO,
  payload: todo,
});

export const updateTodoSuccess = todo => ({
  type: UPDATE_TODO_SUCCESS,
  payload: todo,
});

export const updateTodoFail = error => ({
  type: UPDATE_TODO_FAIL,
  payload: error,
});

export const addNewTodo = todo => ({
  type: ADD_NEW_TODO,
  payload: todo,
});

export const addTodoSuccess = todo => ({
  type: ADD_TODO_SUCCESS,
  payload: todo,
});

export const addTodoFail = error => ({
  type: ADD_TODO_FAIL,
  payload: error,
});

export const deleteTodo = todo => ({
  type: DELETE_TODO,
  payload: todo,
});

export const deleteTodoSuccess = todo => ({
  type: DELETE_TODO_SUCCESS,
  payload: todo,
});

export const deleteTodoFail = error => ({
  type: DELETE_TODO_FAIL,
  payload: error,
});

export const getProjects = () => ({
  type: GET_PROJECTS,
});

export const addNewProject = project => ({
  type: ADD_NEW_PROJECT,
  payload: project,
});

export const addProjectSuccess = project => ({
  type: ADD_PROJECT_SUCCESS,
  payload: project,
});

export const addProjectFail = error => ({
  type: ADD_PROJECT_FAIL,
  payload: error,
});