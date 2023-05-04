import {
    GET_TICKETS_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    ADD_TICKET_SUCCESS,
    ADD_TICKET_FAIL,
    UPDATE_TICKET_SUCCESS,
    UPDATE_TICKET_FAIL,
    DELETE_TICKET_SUCCESS,
    DELETE_TICKET_FAIL,
} from "./actionType";

const INIT_STATE = {
    ticketsList: [],
};

const Tickets = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {

                case GET_TICKETS_LIST:
                    return {
                        ...state,
                        ticketsList: action.payload.data,
                        isTicketCreated: false,
                        isTicketSuccess: true
                    };

                default:
                    return { ...state };
            }

        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TICKETS_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                        isTicketCreated: false,
                        isTicketSuccess: false
                    };

                default:
                    return { ...state };
            }

        case GET_TICKETS_LIST: {
            return {
                ...state,
                isTicketCreated: false,
            };
        }

        case ADD_TICKET_SUCCESS:
            return {
                ...state,
                isTicketCreated: true,
                ticketsList: [...state.ticketsList, action.payload.data],
                isTicketAdd: true,
                isTicketAddFail: false
            };

        case ADD_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
                isTicketAdd: false,
                isTicketAddFail: true
            };

        case UPDATE_TICKET_SUCCESS:
            return {
                ...state,
                ticketsList: state.ticketsList.map(ticket =>
                    ticket._id.toString() === action.payload.data._id.toString()
                        ? { ...ticket, ...action.payload.data }
                        : ticket
                ),
                isTicketUpdate: true,
                isTicketUpdateFail: false
            };

        case UPDATE_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
                isTicketUpdate: false,
                isTicketUpdateFail: true
            };

        case DELETE_TICKET_SUCCESS:
            return {
                ...state,
                ticketsList: state.ticketsList.filter(
                    ticket => ticket._id.toString() !== action.payload.ticket.toString()
                ),
                isTicketDelete: true,
                isTicketDeleteFail: false
            };

        case DELETE_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
                isTicketDelete: false,
                isTicketDeleteFail: true
            };

        default:
            return { ...state };
    }
};

export default Tickets;