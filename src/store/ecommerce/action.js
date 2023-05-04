import {
  GET_PRODUCTS,
  GET_ORDERS,
  GET_SELLERS,
  GET_CUSTOMERS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  DELETE_ORDER,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,

  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,

  ADD_NEW_ORDER,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,

  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  ADD_NEW_CUSTOMER,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  DELETE_CUSTOMER,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,

  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,

  ADD_NEW_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,

  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL
} from "./actionType";

// common success
export const ecommerceApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ecommerceApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getProducts = () => ({
  type: GET_PRODUCTS,
});

export const deleteProducts = product => ({
  type: DELETE_PRODUCT,
  payload: product,
});

export const deleteProductSuccess = product => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: product,
});

export const deleteProductFail = error => ({
  type: DELETE_PRODUCT_FAIL,
  payload: error,
});

export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  payload: product,
});

export const updateProductSuccess = product => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
});

export const updateProductFail = error => ({
  type: UPDATE_PRODUCT_FAIL,
  payload: error,
});

export const addNewProduct = product => ({
  type: ADD_NEW_PRODUCT,
  payload: product,
});

export const addProductSuccess = product => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
});

export const addProductFail = error => ({
  type: ADD_PRODUCT_FAIL,
  payload: error,
});

export const getOrders = () => ({
  type: GET_ORDERS,
});

export const getSellers = () => ({
  type: GET_SELLERS,
});

export const getCustomers = () => ({
  type: GET_CUSTOMERS,
});

export const deleteOrder = order => ({
  type: DELETE_ORDER,
  payload: order,
});

export const deleteOrderSuccess = order => ({
  type: DELETE_ORDER_SUCCESS,
  payload: order,
});

export const deleteOrderFail = error => ({
  type: DELETE_ORDER_FAIL,
  payload: error,
});

export const updateOrder = order => ({
  type: UPDATE_ORDER,
  payload: order,
});

export const updateOrderFail = error => ({
  type: UPDATE_ORDER_FAIL,
  payload: error,
});

export const updateOrderSuccess = order => ({
  type: UPDATE_ORDER_SUCCESS,
  payload: order,
});

export const addNewOrder = order => ({
  type: ADD_NEW_ORDER,
  payload: order,
});

export const addOrderSuccess = order => ({
  type: ADD_ORDER_SUCCESS,
  payload: order,
});

export const addOrderFail = error => ({
  type: ADD_ORDER_FAIL,
  payload: error,
});

export const updateCustomer = customer => ({
  type: UPDATE_CUSTOMER,
  payload: customer,
});

export const updateCustomerSuccess = customer => ({
  type: UPDATE_CUSTOMER_SUCCESS,
  payload: customer,
});

export const updateCustomerFail = error => ({
  type: UPDATE_CUSTOMER_FAIL,
  payload: error,
});

export const addNewCustomer = customer => ({
  type: ADD_NEW_CUSTOMER,
  payload: customer,
});

export const addCustomerSuccess = customer => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload: customer,
});

export const addCustomerFail = error => ({
  type: ADD_CUSTOMER_FAIL,
  payload: error,
});

export const deleteCustomer = customer => ({
  type: DELETE_CUSTOMER,
  payload: customer,
});

export const deleteCustomerSuccess = customer => ({
  type: DELETE_CUSTOMER_SUCCESS,
  payload: customer,
});

export const deleteCustomerFail = error => ({
  type: DELETE_CUSTOMER_FAIL,
  payload: error,
});