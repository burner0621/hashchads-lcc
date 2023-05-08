import {
  CHANGE_LAYOUT,
  CHANGE_SIDEBAR_THEME,
  CHANGE_LAYOUT_MODE,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_LAYOUT_POSITION,
  CHANGE_TOPBAR_THEME,
  CHANGE_SIDEBAR_SIZE_TYPE,
  CHANGE_SIDEBAR_VIEW,
  CHANGE_SIDEBAR_IMAGE_TYPE,
  RESET_VALUE,
  CHANGE_PRELOADER,
  CHANGE_SIDEBAR_VISIBILITY
} from "./actionType";

//constants
import {
  layoutTypes,
  leftSidebarTypes,
  layoutModeTypes,
  layoutWidthTypes,
  layoutPositionTypes,
  topbarThemeTypes,
  leftsidbarSizeTypes,
  leftSidebarViewTypes,
  leftSidebarImageTypes,
  preloaderTypes,
  sidebarVisibilitytypes
} from "../../Components/constants/layout";


const INIT_STATE = {
  layoutType: layoutTypes.HORIZONTAL,
  leftSidebarType: leftSidebarTypes.DARK,
  layoutModeType: layoutModeTypes.DARKMODE,
  layoutWidthType: layoutWidthTypes.FLUID,
  layoutPositionType: layoutPositionTypes.FIXED,
  topbarThemeType: topbarThemeTypes.LIGHT,
  leftsidbarSizeType: leftsidbarSizeTypes.DEFAULT,
  leftSidebarViewType: leftSidebarViewTypes.DEFAULT,
  leftSidebarImageType: leftSidebarImageTypes.NONE,
  preloader: preloaderTypes.DISABLE,
  sidebarVisibilitytype: sidebarVisibilitytypes.SHOW
};

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      };

    case CHANGE_LAYOUT_MODE:
      return {
        ...state,
        layoutModeType: action.payload,
      };

    case CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSidebarType: action.payload,
      };

    case CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidthType: action.payload,
      };

    case CHANGE_LAYOUT_POSITION:
      return {
        ...state,
        layoutPositionType: action.payload,
      };

    case CHANGE_TOPBAR_THEME:
      return {
        ...state,
        topbarThemeType: action.payload,
      };

    case CHANGE_SIDEBAR_SIZE_TYPE:
      return {
        ...state,
        leftsidbarSizeType: action.payload,
      };

    case CHANGE_SIDEBAR_VIEW:
      return {
        ...state,
        leftSidebarViewType: action.payload,
      };

    case CHANGE_SIDEBAR_IMAGE_TYPE:
      return {
        ...state,
        leftSidebarImageType: action.payload,
      };

    case RESET_VALUE:
      return {
        ...state,
        resetValue: INIT_STATE,
      };
      
    case CHANGE_PRELOADER:
      return {
        ...state,
        preloader: action.payload,
      };

    case CHANGE_SIDEBAR_VISIBILITY:
      return {
        ...state,
        sidebarVisibilitytype: action.payload,
      };
    default:
      return state;
  }
};

export default Layout;
