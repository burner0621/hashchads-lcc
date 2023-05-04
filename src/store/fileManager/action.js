import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  
  GET_FOLDERS,
  UPDATE_FOLDER,
  UPDATE_FOLDER_SUCCESS,
  UPDATE_FOLDER_FAIL,
  ADD_NEW_FOLDER,
  ADD_FOLDER_SUCCESS,
  ADD_FOLDER_FAIL,
  DELETE_FOLDER,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAIL,

  GET_FILES,
  UPDATE_FILE,
  UPDATE_FILE_SUCCESS,
  UPDATE_FILE_FAIL,
  ADD_NEW_FILE,
  ADD_FILE_SUCCESS,
  ADD_FILE_FAIL,
  DELETE_FILE,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_FAIL,
} from "./actionType";

// common success
export const fileManagerApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const fileManagerApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getFolders = () => ({
  type: GET_FOLDERS,
});

export const updateFolder = folder => ({
  type: UPDATE_FOLDER,
  payload: folder,
});

export const updateFolderSuccess = folder => ({
  type: UPDATE_FOLDER_SUCCESS,
  payload: folder,
});

export const updateFolderFail = error => ({
  type: UPDATE_FOLDER_FAIL,
  payload: error,
});

export const addNewFolder = folder => ({
  type: ADD_NEW_FOLDER,
  payload: folder,
});

export const addFolderSuccess = folder => ({
  type: ADD_FOLDER_SUCCESS,
  payload: folder,
});

export const addFolderFail = error => ({
  type: ADD_FOLDER_FAIL,
  payload: error,
});

export const deleteFolder = folder => ({
  type: DELETE_FOLDER,
  payload: folder,
});

export const deleteFolderSuccess = folder => ({
  type: DELETE_FOLDER_SUCCESS,
  payload: folder,
});

export const deleteFolderFail = error => ({
  type: DELETE_FOLDER_FAIL,
  payload: error,
});


export const getFiles = () => ({
  type: GET_FILES,
});

export const updateFile = file => ({
  type: UPDATE_FILE,
  payload: file,
});

export const updateFileSuccess = file => ({
  type: UPDATE_FILE_SUCCESS,
  payload: file,
});

export const updateFileFail = error => ({
  type: UPDATE_FILE_FAIL,
  payload: error,
});

export const addNewFile = file => ({
  type: ADD_NEW_FILE,
  payload: file,
});

export const addFileSuccess = file => ({
  type: ADD_FILE_SUCCESS,
  payload: file,
});

export const addFileFail = error => ({
  type: ADD_FILE_FAIL,
  payload: error,
});

export const deleteFile = file => ({
  type: DELETE_FILE,
  payload: file,
});

export const deleteFileSuccess = file => ({
  type: DELETE_FILE_SUCCESS,
  payload: file,
});

export const deleteFileFail = error => ({
  type: DELETE_FILE_FAIL,
  payload: error,
});