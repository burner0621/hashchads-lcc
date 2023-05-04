import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ecoomerce Redux States
import {
  GET_PRODUCTS,
  DELETE_PRODUCT,
  GET_ORDERS,
  GET_SELLERS,
  GET_CUSTOMERS,

  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_NEW_ORDER,

  ADD_NEW_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,

  ADD_NEW_PRODUCT,
  UPDATE_PRODUCT
} from "./actionType";

import {
  ecommerceApiResponseSuccess,
  ecommerceApiResponseError,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderSuccess,
  updateOrderFail,
  addOrderSuccess,
  addOrderFail,
  addCustomerFail,
  addCustomerSuccess,
  updateCustomerSuccess,
  updateCustomerFail,
  deleteCustomerSuccess,
  deleteCustomerFail,
  deleteProductSuccess,
  deleteProductFail,
  addProductSuccess,
  addProductFail,
  updateProductSuccess,
  updateProductFail
} from "./action";

//Include Both Helper File with needed methods
import {
  getProducts as getProductsApi,
  deleteProducts as deleteProductsApi,
  getOrders as getOrdersApi,
  getSellers as getSellersApi,
  getCustomers as getCustomersApi,
  updateOrder,
  deleteOrder,
  addNewOrder,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  addNewProduct,
  updateProduct
} from "../../helpers/fakebackend_helper";

function* getProducts() {
  try {
    const response = yield call(getProductsApi);
    yield put(ecommerceApiResponseSuccess(GET_PRODUCTS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_PRODUCTS, error));
  }
}

function* getOrders() {
  try {
    const response = yield call(getOrdersApi);
    yield put(ecommerceApiResponseSuccess(GET_ORDERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_ORDERS, error));
  }
}

function* getSellers() {
  try {
    const response = yield call(getSellersApi);
    yield put(ecommerceApiResponseSuccess(GET_SELLERS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_SELLERS, error));
  }
}

function* getCustomers() {
  try {
    const response = yield call(getCustomersApi);
    yield put(ecommerceApiResponseSuccess(GET_CUSTOMERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_CUSTOMERS, error));
  }
}

function* deleteProducts({ payload: product }) {
  try {
    const response = yield call(deleteProductsApi, product);
    yield put(deleteProductSuccess({ product, ...response }));
    toast.success("Product Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteProductFail(error));
    toast.error("Product Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewProduct({ payload: product }) {
  try {
    const response = yield call(addNewProduct, product);
    yield put(addProductSuccess(response));
    toast.success("Product Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addProductFail(error));
    toast.error("Product Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateProduct({ payload: product }) {
  try {
    const response = yield call(updateProduct, product);
    yield put(updateProductSuccess(response));
    toast.success("Product Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateProductFail(error));
    toast.error("Product Updateded Failed", { autoClose: 3000 });
  }
}

function* onUpdateOrder({ payload: order }) {
  try {
    const response = yield call(updateOrder, order);
    yield put(updateOrderSuccess(response));
    toast.success("Order Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateOrderFail(error));
    toast.error("Order Updateded Failed", { autoClose: 3000 });
  }
}

function* onDeleteOrder({ payload: order }) {
  try {
    const response = yield call(deleteOrder, order);
    yield put(deleteOrderSuccess({ order, ...response }));
    toast.success("Order Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteOrderFail(error));
    toast.error("Order Deleted Failed", { autoClose: 3000 });
  }
}

function* onAddNewOrder({ payload: order }) {
  try {
    const response = yield call(addNewOrder, order);
    yield put(addOrderSuccess(response));
    toast.success("Order Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addOrderFail(error));
    toast.error("Order Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateCustomer({ payload: customer }) {
  try {
    const response = yield call(updateCustomer, customer);
    yield put(updateCustomerSuccess(response));
    toast.success("Customer Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Customer Updateded Failed", { autoClose: 3000 });
  }
}

function* onDeleteCustomer({ payload: customer }) {
  try {
    const response = yield call(deleteCustomer, customer);
    yield put(deleteCustomerSuccess({ customer, ...response }));
    toast.success("Customer Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCustomerFail(error));
    toast.error("Customer Deleted Failed", { autoClose: 3000 });
  }
}

function* onAddNewCustomer({ payload: customer }) {
  try {
    const response = yield call(addNewCustomer, customer);
    yield put(addCustomerSuccess(response));
    toast.success("Customer Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addCustomerFail(error));
    toast.error("Customer Added Failed", { autoClose: 3000 });
  }
}

export function* watchGetProducts() {
  yield takeEvery(GET_PRODUCTS, getProducts);
}

export function* watchDeleteProducts() {
  yield takeEvery(DELETE_PRODUCT, deleteProducts);
}

export function* watchGetOrders() {
  yield takeEvery(GET_ORDERS, getOrders);
}

export function* watchGetSellers() {
  yield takeEvery(GET_SELLERS, getSellers);
}

export function* watchGetCustomers() {
  yield takeEvery(GET_CUSTOMERS, getCustomers);
}

export function* watchUpdateOrder() {
  yield takeEvery(UPDATE_ORDER, onUpdateOrder);
}

export function* watchDeleteOrder() {
  yield takeEvery(DELETE_ORDER, onDeleteOrder);
}

export function* watchAddNewOrder() {
  yield takeEvery(ADD_NEW_ORDER, onAddNewOrder);
}

export function* watchUpdateCustomer() {
  yield takeEvery(UPDATE_CUSTOMER, onUpdateCustomer);
}

export function* watchDeleteCustomer() {
  yield takeEvery(DELETE_CUSTOMER, onDeleteCustomer);
}

export function* watchAddNewCustomer() {
  yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
}

export function* watchUpdateProduct() {
  yield takeEvery(UPDATE_PRODUCT, onUpdateProduct);
}

export function* watchAddNewProduct() {
  yield takeEvery(ADD_NEW_PRODUCT, onAddNewProduct);
}

function* ecommerceSaga() {
  yield all([
    fork(watchGetProducts),
    fork(watchDeleteProducts),
    fork(watchGetOrders),
    fork(watchGetSellers),
    fork(watchGetCustomers),
    fork(watchDeleteOrder),
    fork(watchUpdateOrder),
    fork(watchAddNewOrder),
    fork(watchDeleteCustomer),
    fork(watchUpdateCustomer),
    fork(watchAddNewCustomer),
    fork(watchUpdateProduct),
    fork(watchAddNewProduct),
  ]);
}

export default ecommerceSaga;
