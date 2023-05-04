import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_TODOS,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAIL,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_FAIL,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_FAIL,

  GET_PROJECTS,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL
} from "./actionType";

const INIT_STATE = {
  todos: [],
  projects: [],
  error: {},
};

const Todos = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_TODOS:
          return {
            ...state,
            todos: action.payload.data,
          };

        case GET_PROJECTS:
          return {
            ...state,
            projects: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_TODOS:
          return {
            ...state,
            error: action.payload.error,
          };

        case GET_PROJECTS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_TODO_SUCCESS:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case ADD_TODO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id.toString() === action.payload.id.toString()
            ? { ...todo, ...action.payload }
            : todo
        ),
      };

    case UPDATE_TODO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter(
          todo => todo.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_TODO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_PROJECT_SUCCESS:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };

    case ADD_PROJECT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Todos;