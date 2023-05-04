import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_FOLDERS,
  ADD_FOLDER_SUCCESS,
  ADD_FOLDER_FAIL,
  UPDATE_FOLDER_SUCCESS,
  UPDATE_FOLDER_FAIL,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAIL,

  GET_FILES,
  ADD_FILE_SUCCESS,
  ADD_FILE_FAIL,
  UPDATE_FILE_SUCCESS,
  UPDATE_FILE_FAIL,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_FAIL,
} from "./actionType";

const INIT_STATE = {
  folders: [],
  files: [],
  error: {},
};

const FileManager = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_FOLDERS:
          return {
            ...state,
            folders: action.payload.data,
          };
        case GET_FILES:
          return {
            ...state,
            files: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_FOLDERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_FILES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_FOLDER_SUCCESS:
      return {
        ...state,
        folders: [...state.folders, action.payload],
      };

    case ADD_FOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_FOLDER_SUCCESS:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id.toString() === action.payload.id.toString()
            ? { ...folder, ...action.payload }
            : folder
        ),
      };

    case UPDATE_FOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        folders: state.folders.filter(
          folder => folder.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_FOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_FILE_SUCCESS:
      return {
        ...state,
        files: [...state.files, action.payload],
      };

    case ADD_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_FILE_SUCCESS:
      return {
        ...state,
        files: state.files.map(file =>
          file.id.toString() === action.payload.id.toString()
            ? { ...file, ...action.payload }
            : file
        ),
      };

    case UPDATE_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FILE_SUCCESS:
      return {
        ...state,
        files: state.files.filter(
          file => file.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default FileManager;