// @flow
import { all, call, fork, takeEvery } from "redux-saga/effects";

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
    CHANGE_PRELOADER,
    CHANGE_SIDEBAR_VISIBILITY
} from './actionType';

/**
 * Changes the body attribute
 */
function changeHTMLAttribute(attribute, value) {
    if (document.documentElement) document.documentElement.setAttribute(attribute, value);
    return true;
}

/**
 * Changes the layout type
 * @param {*} param0
 */
function* changeLayoutTheme({ payload: layout }) {
    try {
        if (layout === "twocolumn") {
            document.documentElement.removeAttribute("data-layout-width");
        } else if (layout === "horizontal") {
            document.documentElement.removeAttribute("data-sidebar-size");
        }
        yield call(changeHTMLAttribute, "data-layout", layout);
    } catch (error) {
        // console.log(error);
    }
}


/**
 * Changes the layout mode
 * @param {*} param0
 */
function* changeLayoutMode({ payload: mode }) {
    try {
        yield call(changeHTMLAttribute, "data-layout-mode", mode);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
function* changeLeftSidebarTheme({ payload: theme }) {   
    try {
        yield call(changeHTMLAttribute, "data-sidebar", theme);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the layout width
 * @param {*} param0
 */
function* changeLayoutWidth({ payload: layoutWidth }) {
    try {
        if (layoutWidth === 'lg') {
            yield call(changeHTMLAttribute, "data-layout-width", "fluid");
        } else {
            yield call(changeHTMLAttribute, "data-layout-width", "boxed");
        }
        // yield call(changeHTMLAttribute, "data-sidebar-size", layoutWidth);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the layout position
 * @param {*} param0
 */
function* changeLayoutPosition({ payload: layoutposition }) {
    try {
        yield call(changeHTMLAttribute, "data-layout-position", layoutposition);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the layout visiilty
 * @param {*} param0
 */
function* changeSidebarVisibility({ payload: visibility }) {
    try {
        yield call(changeHTMLAttribute, "data-sidebar-visibility", visibility);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the topbar themes
 * @param {*} param0
 */
function* changeTopbarTheme({ payload: topbarTheme }) {
    try {
        yield call(changeHTMLAttribute, "data-topbar", topbarTheme);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the topbar themes
 * @param {*} param0
 */
 function* changeSidebarImageType({ payload: leftsidebarImagetype }) {
    try {
        yield call(changeHTMLAttribute, "data-sidebar-image", leftsidebarImagetype);
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the Preloader
 * @param {*} param0
 */
 function* changePreloader({ payload: preloaderTypes }) {
    try {
        yield call(changeHTMLAttribute, "data-preloader", preloaderTypes);
    } catch (error) {
        // console.log(error);
    }
}


/**
 * Changes the topbar themes
 * @param {*} param0
 */
function* changeLeftsidebarSizeType({ payload: leftsidebarSizetype }) {
    try {
        switch (leftsidebarSizetype) {
            case 'lg':
                yield call(changeHTMLAttribute, "data-sidebar-size", "lg");
                break;
            case 'md':
                yield call(changeHTMLAttribute, "data-sidebar-size", "md");
                break;
            case "sm":
                yield call(changeHTMLAttribute, "data-sidebar-size", "sm");
                break;
            case "sm-hover":
                yield call(changeHTMLAttribute, "data-sidebar-size", "sm-hover");
                break;
            default:
                yield call(changeHTMLAttribute, "data-sidebar-size", "lg");
        }
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Changes the topbar themes
 * @param {*} param0
 */
function* changeLeftSidebarViewType({ payload: leftsidebarViewtype }) {
    try {
        if(document.documentElement.getAttribute("data-layout") !== "semibox"){
            yield call(changeHTMLAttribute, "data-layout-style", leftsidebarViewtype);
        }else {
            document.documentElement.removeAttribute("data-layout-style");
        }
    } catch (error) {
        // console.log(error);
    }
}

/**
 * Watchers
 */
export function* watchChangeLayoutType() {
    yield takeEvery(CHANGE_LAYOUT, changeLayoutTheme);
}
export function* watchChangeLayoutMode() {
    yield takeEvery(CHANGE_LAYOUT_MODE, changeLayoutMode);
}
export function* watchChangeLeftSidebarTheme() {
    yield takeEvery(CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme);
}
export function* watchChangeLayoutWidth() {
    yield takeEvery(CHANGE_LAYOUT_WIDTH, changeLayoutWidth);
}
export function* watchChangeLayoutPosition() {
    yield takeEvery(CHANGE_LAYOUT_POSITION, changeLayoutPosition);
}
export function* watchChangeTopbarTheme() {
    yield takeEvery(CHANGE_TOPBAR_THEME, changeTopbarTheme);
}
export function* watchChangeLeftsidebarSizeType() {
    yield takeEvery(CHANGE_SIDEBAR_SIZE_TYPE, changeLeftsidebarSizeType);
}
export function* watchChangeLeftSidebarViewType() {
    yield takeEvery(CHANGE_SIDEBAR_VIEW, changeLeftSidebarViewType);
}
export function* watchChangeSidebarImageType() {
    yield takeEvery(CHANGE_SIDEBAR_IMAGE_TYPE, changeSidebarImageType);
}
export function* watchchangePreloader() {
    yield takeEvery(CHANGE_PRELOADER, changePreloader);
}
export function* watchchangeSidebarVisibility() {
    yield takeEvery(CHANGE_SIDEBAR_VISIBILITY, changeSidebarVisibility);
}

function* LayoutSaga() {
    yield all([
        fork(watchChangeLayoutType),
        fork(watchChangeLeftSidebarTheme),
        fork(watchChangeLayoutMode),
        fork(watchChangeLayoutWidth),
        fork(watchChangeLayoutPosition),
        fork(watchChangeTopbarTheme),
        fork(watchChangeLeftsidebarSizeType),
        fork(watchChangeLeftSidebarViewType),
        fork(watchChangeSidebarImageType),
        fork(watchchangePreloader),
        fork(watchchangeSidebarVisibility)
    ]);
}

export default LayoutSaga;