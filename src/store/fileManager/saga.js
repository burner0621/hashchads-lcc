import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {
  GET_FOLDERS,
  ADD_NEW_FOLDER,
  DELETE_FOLDER,
  UPDATE_FOLDER,

  GET_FILES,
  ADD_NEW_FILE,
  DELETE_FILE,
  UPDATE_FILE,
} from "./actionType";

import {
  fileManagerApiResponseSuccess,
  fileManagerApiResponseError,
  addFolderSuccess,
  addFolderFail,
  updateFolderSuccess,
  updateFolderFail,
  deleteFolderSuccess,
  deleteFolderFail,

  addFileSuccess,
  addFileFail,
  updateFileSuccess,
  updateFileFail,
  deleteFileSuccess,
  deleteFileFail
} from "./action";

//Include Both Helper File with needed methods
import {
  getFolders as getFoldersApi,
  addNewFolder,
  updateFolder,
  deleteFolder,

  getFiles as getFilesApi,
  addNewFile,
  updateFile,
  deleteFile,
} from "../../helpers/fakebackend_helper";

function* getFolders() {
  try {
    const response = yield call(getFoldersApi);
    yield put(fileManagerApiResponseSuccess(GET_FOLDERS, response));
  } catch (error) {
    yield put(fileManagerApiResponseError(GET_FOLDERS, error));
  }
}

function* onAddNewFolder({ payload: folder }) {

  try {
    const response = yield call(addNewFolder, folder);
    yield put(addFolderSuccess(response));
    toast.success("Folder Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addFolderFail(error));
    toast.error("Folder Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateFolder({ payload: folder }) {
  try {
    const response = yield call(updateFolder, folder);

    yield put(updateFolderSuccess(response));
    toast.success("Folder Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateFolderFail(error));
    toast.error("Folder Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteFolder({ payload: folder }) {
  try {
    const response = yield call(deleteFolder, folder);
    yield put(deleteFolderSuccess({ folder, ...response }));
    toast.success("Folder Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteFolderFail(error));
    toast.error("Folder Delete Failed", { autoClose: 3000 });
  }
}

function* getFiles() {
  try {
    const response = yield call(getFilesApi);
    yield put(fileManagerApiResponseSuccess(GET_FILES, response));
  } catch (error) {
    yield put(fileManagerApiResponseError(GET_FILES, error));
  }
}

function* onAddNewFile({ payload: file }) {

  try {
    const response = yield call(addNewFile, file);
    yield put(addFileSuccess(response));
    toast.success("File Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addFileFail(error));
    toast.error("File Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateFile({ payload: file }) {
  try {
    const response = yield call(updateFile, file);

    yield put(updateFileSuccess(response));
    toast.success("File Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateFileFail(error));
    toast.error("File Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteFile({ payload: file }) {
  try {
    const response = yield call(deleteFile, file);
    yield put(deleteFileSuccess({ file, ...response }));
    toast.success("File Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteFileFail(error));
    toast.error("File Delete Failed", { autoClose: 3000 });
  }
}


export function* watchGetFolders() {
  yield takeEvery(GET_FOLDERS, getFolders);
}

export function* watchUpdateFolder() {
  yield takeEvery(UPDATE_FOLDER, onUpdateFolder);
}

export function* watchDeleteFolder() {
  yield takeEvery(DELETE_FOLDER, onDeleteFolder);
}

export function* watchAddNewFolder() {
  yield takeEvery(ADD_NEW_FOLDER, onAddNewFolder);
}

export function* watchGetFiles() {
  yield takeEvery(GET_FILES, getFiles);
}

export function* watchUpdateFile() {
  yield takeEvery(UPDATE_FILE, onUpdateFile);
}

export function* watchDeleteFile() {
  yield takeEvery(DELETE_FILE, onDeleteFile);
}

export function* watchAddNewFile() {
  yield takeEvery(ADD_NEW_FILE, onAddNewFile);
}

function* fileManager() {
  yield all([
    fork(watchGetFolders),
    fork(watchAddNewFolder),
    fork(watchUpdateFolder),
    fork(watchDeleteFolder),
    fork(watchGetFiles),
    fork(watchAddNewFile),
    fork(watchUpdateFile),
    fork(watchDeleteFile),
  ]);
}

export default fileManager;