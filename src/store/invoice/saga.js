import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {
  GET_INVOICES,
  ADD_NEW_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE
} from "./actionType";

import {
  invoiceApiResponseSuccess,
  invoiceApiResponseError,
  addInvoiceSuccess,
  addInvoiceFail,
  updateInvoiceSuccess,
  updateInvoiceFail,
  deleteInvoiceSuccess,
  deleteInvoiceFail
} from "./action";

//Include Both Helper File with needed methods
import {
  getInvoices as getInvoicesApi,
  addNewInvoice,
  updateInvoice,
  deleteInvoice
} from "../../helpers/fakebackend_helper";

function* getInvoices() {
  try {
    const response = yield call(getInvoicesApi);
    yield put(invoiceApiResponseSuccess(GET_INVOICES, response.data));
  } catch (error) {
    yield put(invoiceApiResponseError(GET_INVOICES, error));
  }
}

function* onAddNewInvoice({ payload: invoice }) {
  try {
    const response = yield call(addNewInvoice, invoice);

    yield put(addInvoiceSuccess(response));
    toast.success("Invoice Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addInvoiceFail(error));
    toast.error("Invoice Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateInvoice({ payload: invoice }) {
  try {
    const response = yield call(updateInvoice, invoice);
    yield put(updateInvoiceSuccess(response));
    toast.success("Invoice Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateInvoiceFail(error));
    toast.error("Invoice Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteInvoice({ payload: invoice }) {
  try {
    const response = yield call(deleteInvoice, invoice);
    yield put(deleteInvoiceSuccess({ invoice, ...response }));
    toast.success("Invoice Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteInvoiceFail(error));
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetInvoices() {
  yield takeEvery(GET_INVOICES, getInvoices);
}

export function* watchUpdateInvoice() {
  yield takeEvery(UPDATE_INVOICE, onUpdateInvoice);
}

export function* watchDeleteInvoice() {
  yield takeEvery(DELETE_INVOICE, onDeleteInvoice);
}

export function* watchAddNewInvoice() {
  yield takeEvery(ADD_NEW_INVOICE, onAddNewInvoice);
}

function* invoiceSaga() {
  yield all([
    fork(watchGetInvoices),
    fork(watchAddNewInvoice),
    fork(watchDeleteInvoice),
    fork(watchUpdateInvoice),
  ]);
}

export default invoiceSaga;