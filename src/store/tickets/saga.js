import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ticket Redux States
import {
    GET_TICKETS_LIST,
    ADD_NEW_TICKET,
    DELETE_TICKET,
    UPDATE_TICKET,
} from "./actionType";
import {
    TicketsApiResponseSuccess,
    TicketsApiResponseError,
    addTicketSuccess,
    addTicketFail,
    updateTicketSuccess,
    updateTicketFail,
    deleteTicketSuccess,
    deleteTicketFail,
} from "./action";

//Include Both Helper File with needed methods
import {
    getTicketsList as getTicketsListApi,
    addNewTicket,
    updateTicket,
    deleteTicket
}
    from "../../helpers/fakebackend_helper";

function* getTicketsList() {
    try {
        const response = yield call(getTicketsListApi);
        yield put(TicketsApiResponseSuccess(GET_TICKETS_LIST, response.data));
    } catch (error) {
        yield put(TicketsApiResponseError(GET_TICKETS_LIST, error));
    }
}

function* onAddNewTicket({ payload: ticket }) {
    try {
        const response = yield call(addNewTicket, ticket);
        yield put(addTicketSuccess(response));
        toast.success("Ticket Added Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(addTicketFail(error));
        toast.error("Ticket Added Failed", { autoClose: 3000 });
    }
}

function* onUpdateTicket({ payload: ticket }) {
    try {
        const response = yield call(updateTicket, ticket);
        yield put(updateTicketSuccess(response));
        toast.success("Ticket Updated Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(updateTicketFail(error));
        toast.error("Ticket Updated Failed", { autoClose: 3000 });
    }
}

function* onDeleteTicket({ payload: ticket }) {
    try {
        const response = yield call(deleteTicket, ticket);

        yield put(deleteTicketSuccess({ ticket, ...response }));
        toast.success("Ticket Delete Successfully", { autoClose: 3000 });
    } catch (error) {
        yield put(deleteTicketFail(error));
        toast.error("Ticket Delete Failed", { autoClose: 3000 });
    }
}

export function* watchGetTicketsList() {
    yield takeEvery(GET_TICKETS_LIST, getTicketsList);
}

export function* watchAddNewTicket() {
    yield takeEvery(ADD_NEW_TICKET, onAddNewTicket);
}

export function* watchUpdateTicket() {
    yield takeEvery(UPDATE_TICKET, onUpdateTicket);
}

export function* watchDeleteTicket() {
    yield takeEvery(DELETE_TICKET, onDeleteTicket);
}


function* ticketsSaga() {
    yield all(
        [
            fork(watchGetTicketsList),
            fork(watchAddNewTicket),
            fork(watchUpdateTicket),
            fork(watchDeleteTicket)
        ]
    );
}

export default ticketsSaga;