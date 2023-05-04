import {
  GET_INVOICES,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAIL,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAIL,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAIL,
} from "./actionType";

const INIT_STATE = {
  invoices: [],
  error: {},
};

const Invoice = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_INVOICES:
          return {
            ...state,
            invoices: action.payload.data,
            isInvoiceCreated: false,
            isInvoiceSuccess: true
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_INVOICES:
          return {
            ...state,
            error: action.payload.error,
            isInvoiceCreated: false,
            isInvoiceSuccess: false
          };
        default:
          return { ...state };
      }

    case ADD_INVOICE_SUCCESS:
      return {
        ...state,
        isInvoiceCreated: true,
        invoices: [...state.invoices, action.payload.data],
      };

    case ADD_INVOICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice._id.toString() === action.payload.data._id.toString()
            ? { ...invoice, ...action.payload.data }
            : invoice
        ),
      };

    case UPDATE_INVOICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        invoices: state.invoices.filter(
          invoice => invoice._id.toString() !== action.payload.invoice.toString()
        ),
        isInvoiceDelete: true,
        isInvoiceDeleteFail: false,
      };

    case DELETE_INVOICE_FAIL:
      return {
        ...state,
        error: action.payload,
        isInvoiceDelete: false,
        isInvoiceDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default Invoice;