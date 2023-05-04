import {
  GET_CONTACTS,
  GET_COMPANIES,
  GET_DEALS,
  GET_LEADS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  ADD_COMPANIES_SUCCESS,
  ADD_COMPANIES_FAIL,
  UPDATE_COMPANIES_SUCCESS,
  UPDATE_COMPANIES_FAIL,
  DELETE_COMPANIES_SUCCESS,
  DELETE_COMPANIES_FAIL,

  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAIL,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,

  ADD_LEAD_SUCCESS,
  ADD_LEAD_FAIL,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  DELETE_LEAD_SUCCESS,
  DELETE_LEAD_FAIL,
} from "./actionType";

const INIT_STATE = {
  crmcontacts: [],
  companies: [],
  deals: [],
  leads: [],
  error: {},
};

const Crm = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_CONTACTS:
          return {
            ...state,
            crmcontacts: action.payload.data,
            isContactCreated: false,
            isContactSuccess: true
          };
        case GET_COMPANIES:
          return {
            ...state,
            companies: action.payload.data,
            isCompaniesCreated: false,
            isCompaniesSuccess: true
          };
        case GET_DEALS:
          return {
            ...state,
            deals: action.payload.data,
          };
        case GET_LEADS:
          return {
            ...state,
            leads: action.payload.data,
            isLeadCreated: false,
            isLeadsSuccess: true
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_CONTACTS:
          return {
            ...state,
            error: action.payload.error,
            isContactCreated: false,
            isContactSuccess: false
          };
        case GET_COMPANIES:
          return {
            ...state,
            error: action.payload.error,
            isCompaniesCreated: false,
            isCompaniesSuccess: false
          };
        case GET_DEALS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_LEADS:
          return {
            ...state,
            error: action.payload.error,
            isLeadCreated: false,
            isLeadsSuccess: false
          };
        default:
          return { ...state };
      }
    case GET_COMPANIES: {
      return {
        ...state,
        isCompaniesCreated: false
      };
    }
    case GET_DEALS: {
      return {
        ...state,
      };
    }
    case GET_LEADS:
      return {
        ...state,
        isLeadCreated: false
      };
    case ADD_COMPANIES_SUCCESS:
      return {
        ...state,
        isCompaniesCreated: true,
        companies: [...state.companies, action.payload.data],
        isCompaniesAdd: true,
        isCompaniesAddFail: false,
      };

    case ADD_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
        isCompaniesAdd: false,
        isCompaniesAddFail: true,
      };

    case UPDATE_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: state.companies.map(company =>
          company._id.toString() === action.payload.data._id.toString()
            ? { ...company, ...action.payload.data }
            : company
        ),
        isCompaniesUpdate: true,
        isCompaniesUpdateFail: false,
      };

    case UPDATE_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
        isCompaniesUpdate: false,
        isCompaniesUpdateFail: true,
      };

    case DELETE_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: state.companies.filter(
          company => company._id.toString() !== action.payload.companies.toString()
        ),
        isCompaniesDelete: true,
        isCompaniesDeleteFail: false
      };

    case DELETE_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
        isCompaniesDelete: false,
        isCompaniesDeleteFail: true
      };

    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        isContactCreated: true,
        crmcontacts: [...state.crmcontacts, action.payload.data],
        isContactAdd: true,
        isContactAddFail: false
      };

    case ADD_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
        isContactAdd: false,
        isContactAddFail: true
      };

    case UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        crmcontacts: state.crmcontacts.map(contact =>
          contact._id.toString() === action.payload.data._id.toString()
            ? { ...contact, ...action.payload.data }
            : contact
        ),
        isContactUpdate: true,
        isContactUpdateFail: false
      };

    case UPDATE_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
        isContactUpdate: false,
        isContactUpdateFail: true
      };

    case DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        crmcontacts: state.crmcontacts.filter(
          contact => contact._id.toString() !== action.payload.contact.toString()
        ),
        isContactDelete: true,
        isContactDeleteFail: false
      };

    case DELETE_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
        isContactDelete: false,
        isContactDeleteFail: true
      };

    case ADD_LEAD_SUCCESS:
      return {
        ...state,
        isLeadCreated: true,
        leads: [...state.leads, action.payload.data],
        isLeadsAdd: true,
        isLeadsAddFail: false,
      };

    case ADD_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
        isLeadsAdd: false,
        isLeadsAddFail: true,
      };

    case UPDATE_LEAD_SUCCESS:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead._id.toString() === action.payload.data._id.toString()
            ? { ...lead, ...action.payload.data }
            : lead
        ),
        isLeadsUpdate: true,
        isLeadsUpdateFail: false
      };

    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
        isLeadsUpdate: false,
        isLeadsUpdateFail: true
      };

    case DELETE_LEAD_SUCCESS:
      return {
        ...state,
        leads: state.leads.filter(
          lead => lead._id.toString() !== action.payload.leads.toString()
        ),
        isLeadsDelete: true,
        isLeadsDeleteFail: false
      };

    case DELETE_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
        isLeadsDelete: false,
        isLeadsDeleteFail: true
      };

    default:
      return { ...state };
  }
};

export default Crm;
