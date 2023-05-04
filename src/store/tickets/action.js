import {
    GET_TICKETS_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    UPDATE_TICKET,
    UPDATE_TICKET_SUCCESS,
    UPDATE_TICKET_FAIL,
    ADD_NEW_TICKET,
    ADD_TICKET_SUCCESS,
    ADD_TICKET_FAIL,
    DELETE_TICKET,
    DELETE_TICKET_SUCCESS,
    DELETE_TICKET_FAIL,
} from "./actionType";

// common success
export const TicketsApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const TicketsApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getTicketsList = () => ({
    type: GET_TICKETS_LIST,
});

export const updateTicket = ticket => ({
    type: UPDATE_TICKET,
    payload: ticket,
});

export const updateTicketSuccess = ticket => ({
    type: UPDATE_TICKET_SUCCESS,
    payload: ticket,
});

export const updateTicketFail = error => ({
    type: UPDATE_TICKET_FAIL,
    payload: error,
});

export const addNewTicket = ticket => ({
    type: ADD_NEW_TICKET,
    payload: ticket,
});

export const addTicketSuccess = ticket => ({
    type: ADD_TICKET_SUCCESS,
    payload: ticket,
});

export const addTicketFail = error => ({
    type: ADD_TICKET_FAIL,
    payload: error,
});

export const deleteTicket = ticket => ({
    type: DELETE_TICKET,
    payload: ticket,
});

export const deleteTicketSuccess = ticket => ({
    type: DELETE_TICKET_SUCCESS,
    payload: ticket,
});

export const deleteTicketFail = error => ({
    type: DELETE_TICKET_FAIL,
    payload: error,
});