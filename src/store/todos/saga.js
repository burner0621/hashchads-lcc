import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {
  GET_TODOS,
  ADD_NEW_TODO,
  DELETE_TODO,
  UPDATE_TODO,

  GET_PROJECTS,
  ADD_NEW_PROJECT
} from "./actionType";

import {
  toDoApiResponseSuccess,
  toDoApiResponseError,
  addTodoSuccess,
  addTodoFail,
  updateTodoSuccess,
  updateTodoFail,
  deleteTodoSuccess,
  deleteTodoFail,

  addProjectSuccess,
  addProjectFail
} from "./action";

//Include Both Helper File with needed methods
import {
  getTodos as getTodosApi,
  addNewTodo,
  updateTodo,
  deleteTodo,

  getProjects as getProjectsApi,
  addNewProject,
} from "../../helpers/fakebackend_helper";

function* getTodos() {
  try {
    const response = yield call(getTodosApi);
    yield put(toDoApiResponseSuccess(GET_TODOS, response));
  } catch (error) {
    yield put(toDoApiResponseError(GET_TODOS, error));
  }
}

function* onAddNewTodo({ payload: todo }) {

  try {
    const response = yield call(addNewTodo, todo);
    yield put(addTodoSuccess(response));
    toast.success("Todo Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addTodoFail(error));
    toast.error("Todo Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateTodo({ payload: todo }) {
  try {
    const response = yield call(updateTodo, todo);

    yield put(updateTodoSuccess(response));
    toast.success("Todo Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateTodoFail(error));
    toast.error("Todo Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteTodo({ payload: todo }) {
  try {
    const response = yield call(deleteTodo, todo);
    yield put(deleteTodoSuccess({ todo, ...response }));
    toast.success("Todo Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteTodoFail(error));
    toast.error("Todo Delete Failed", { autoClose: 3000 });
  }
}

function* getProjects() {
  try {
    const response = yield call(getProjectsApi);
    yield put(toDoApiResponseSuccess(GET_PROJECTS, response));
  } catch (error) {
    yield put(toDoApiResponseError(GET_PROJECTS, error));
  }
}

function* onAddNewProject({ payload: project }) {
  try {
    const response = yield call(addNewProject, project);
    yield put(addProjectSuccess(response));
    toast.success("Project Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addProjectFail(error));
    toast.error("Project Added Failed", { autoClose: 3000 });
  }
}


export function* watchGetTodos() {
  yield takeEvery(GET_TODOS, getTodos);
}

export function* watchUpdateTodo() {
  yield takeEvery(UPDATE_TODO, onUpdateTodo);
}

export function* watchDeleteTodo() {
  yield takeEvery(DELETE_TODO, onDeleteTodo);
}

export function* watchAddNewTodo() {
  yield takeEvery(ADD_NEW_TODO, onAddNewTodo);
}

export function* watchGetProjects() {
  yield takeEvery(GET_PROJECTS, getProjects);
}

export function* watchAddNewProject() {
  yield takeEvery(ADD_NEW_PROJECT, onAddNewProject);
}

function* todos() {
  yield all([
    fork(watchGetTodos),
    fork(watchAddNewTodo),
    fork(watchUpdateTodo),
    fork(watchDeleteTodo),
    fork(watchGetProjects),
    fork(watchAddNewProject),
  ]);
}

export default todos;