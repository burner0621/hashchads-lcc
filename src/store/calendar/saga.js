import { takeEvery, put, call } from "redux-saga/effects"

// Calender Redux States
import {
  ADD_NEW_EVENT,
  DELETE_EVENT,
  GET_CATEGORIES,
  GET_EVENTS,
  UPDATE_EVENT,
  GET_UPCOMMINGEVENT
} from "./actionTypes"

import {
  getEventsSuccess,
  getEventsFail,
  addEventFail,
  addEventSuccess,
  updateEventSuccess,
  updateEventFail,
  deleteEventSuccess,
  deleteEventFail,
  getCategoriesSuccess,
  getCategoriesFail,
  getUpCommingEventSuccess,
  getUpCommingEventFail
} from "./actions"

//Include Both Helper File with needed methods
import {
  getEvents,
  addNewEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  getUpCommingEvent
} from "../../helpers/fakebackend_helper"

function* fetchEvents() {
  try {
    const response = yield call(getEvents)
    yield put(getEventsSuccess(response))
  } catch (error) {
    yield put(getEventsFail(error))
  }
}

function* onAddNewEvent({ payload: event }) {
  try {
    const response = yield call(addNewEvent, event)
    yield put(addEventSuccess(response))
  } catch (error) {
    yield put(addEventFail(error))
  }
}

function* onUpdateEvent({ payload: event }) {
  try {
    const response = yield call(updateEvent, event)
    yield put(updateEventSuccess(response))
  } catch (error) {
    yield put(updateEventFail(error))
  }
}

function* onDeleteEvent({ payload: event }) {
  try {
    const response = yield call(deleteEvent, event)
    yield put(deleteEventSuccess(response))
  } catch (error) {
    yield put(deleteEventFail(error))
  }
}

function* onGetCategories() {
  try {
    const response = yield call(getCategories)
    yield put(getCategoriesSuccess(response))
  } catch (error) {
    yield put(getCategoriesFail(error))
  }
}

function* onGetUpcommingEvents() {
  try {
    const response = yield call(getUpCommingEvent)
    yield put(getUpCommingEventSuccess(response))
  } catch (error) {
    yield put(getUpCommingEventFail(error))
  }
}

function* calendarSaga() {
  yield takeEvery(GET_EVENTS, fetchEvents)
  yield takeEvery(ADD_NEW_EVENT, onAddNewEvent)
  yield takeEvery(UPDATE_EVENT, onUpdateEvent)
  yield takeEvery(DELETE_EVENT, onDeleteEvent)
  yield takeEvery(GET_CATEGORIES, onGetCategories)
  yield takeEvery(GET_UPCOMMINGEVENT, onGetUpcommingEvents)

}

export default calendarSaga
