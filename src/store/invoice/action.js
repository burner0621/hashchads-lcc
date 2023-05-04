import {
  GET_INVOICES,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  UPDATE_INVOICE,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAIL,
  ADD_NEW_INVOICE,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAIL,
  DELETE_INVOICE,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAIL,
} from "./actionType";

// common success
export const invoiceApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const invoiceApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getInvoices = () => ({
  type: GET_INVOICES,
});

export const updateInvoice = invoice => ({
  type: UPDATE_INVOICE,
  payload: invoice,
});

export const updateInvoiceSuccess = invoice => ({
  type: UPDATE_INVOICE_SUCCESS,
  payload: invoice,
});

export const updateInvoiceFail = error => ({
  type: UPDATE_INVOICE_FAIL,
  payload: error,
});

export const addNewInvoice = invoice => ({
  type: ADD_NEW_INVOICE,
  payload: invoice,
});

export const addInvoiceSuccess = invoice => ({
  type: ADD_INVOICE_SUCCESS,
  payload: invoice,
});

export const addInvoiceFail = error => ({
  type: ADD_INVOICE_FAIL,
  payload: error,
});

export const deleteInvoice = invoice => ({
  type: DELETE_INVOICE,
  payload: invoice,
});

export const deleteInvoiceSuccess = invoice => ({
  type: DELETE_INVOICE_SUCCESS,
  payload: invoice,
});

export const deleteInvoiceFail = error => ({
  type: DELETE_INVOICE_FAIL,
  payload: error,
});