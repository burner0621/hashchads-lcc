import {
    GET_CONTACTS,
    GET_COMPANIES,
    GET_DEALS,
    GET_LEADS,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    UPDATE_COMPANIES,
    UPDATE_COMPANIES_SUCCESS,
    UPDATE_COMPANIES_FAIL,
    ADD_NEW_COMPANIES,
    ADD_COMPANIES_SUCCESS,
    ADD_COMPANIES_FAIL,
    DELETE_COMPANIES,
    DELETE_COMPANIES_SUCCESS,
    DELETE_COMPANIES_FAIL,
  
    UPDATE_CONTACT,
    UPDATE_CONTACT_SUCCESS,
    UPDATE_CONTACT_FAIL,
    ADD_NEW_CONTACT,
    ADD_CONTACT_SUCCESS,
    ADD_CONTACT_FAIL,
    DELETE_CONTACT,
    DELETE_CONTACT_SUCCESS,
    DELETE_CONTACT_FAIL,

    UPDATE_LEAD,
    UPDATE_LEAD_SUCCESS,
    UPDATE_LEAD_FAIL,
    ADD_NEW_LEAD,
    ADD_LEAD_SUCCESS,
    ADD_LEAD_FAIL,
    DELETE_LEAD,
    DELETE_LEAD_SUCCESS,
    DELETE_LEAD_FAIL,
  } from "./actionType";

  // common success
export const crmApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
  });
  // common error
  export const crmApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
  });
  
  export const getContacts = () => ({
    type: GET_CONTACTS,
  });
  
  export const getCompanies = () => ({
    type: GET_COMPANIES,
  });
  
  export const getDeals = () => ({
    type: GET_DEALS,
  });
  
  export const getLeads = () => ({
    type: GET_LEADS,
  })

  export const updateCompanies = companies => ({
    type: UPDATE_COMPANIES,
    payload: companies,
  });
  
  export const updateCompaniesSuccess = companies => ({
    type: UPDATE_COMPANIES_SUCCESS,
    payload: companies,
  });
  
  export const updateCompaniesFail = error => ({
    type: UPDATE_COMPANIES_FAIL,
    payload: error,
  });
  
  export const addNewCompanies = companies => ({
    type: ADD_NEW_COMPANIES,
    payload: companies,
  });
  
  export const addCompaniesSuccess = companies => ({
    type: ADD_COMPANIES_SUCCESS,
    payload: companies,
  });
  
  export const addCompaniesFail = error => ({
    type: ADD_COMPANIES_FAIL,
    payload: error,
  });
  
  export const deleteCompanies = companies => ({
    type: DELETE_COMPANIES,
    payload: companies,
  });
  
  export const deleteCompaniesSuccess = companies => ({
    type: DELETE_COMPANIES_SUCCESS,
    payload: companies,
  });
  
  export const deleteCompaniesFail = error => ({
    type: DELETE_COMPANIES_FAIL,
    payload: error,
  });

  export const updateContact = contact => ({
    type: UPDATE_CONTACT,
    payload: contact,
  });
  
  export const updateContactSuccess = contact => ({
    type: UPDATE_CONTACT_SUCCESS,
    payload: contact,
  });
  
  export const updateContactFail = error => ({
    type: UPDATE_CONTACT_FAIL,
    payload: error,
  });
  
  export const addNewContact = contact => ({
    type: ADD_NEW_CONTACT,
    payload: contact,
  });
  
  export const addContactSuccess = contact => ({
    type: ADD_CONTACT_SUCCESS,
    payload: contact,
  });
  
  export const addContactFail = error => ({
    type: ADD_CONTACT_FAIL,
    payload: error,
  });
  
  export const deleteContact = contact => ({
    type: DELETE_CONTACT,
    payload: contact,
  });
  
  export const deleteContactSuccess = contact => ({
    type: DELETE_CONTACT_SUCCESS,
    payload: contact,
  });
  
  export const deleteContactFail = error => ({
    type: DELETE_CONTACT_FAIL,
    payload: error,
  });

  export const updateLead = lead => ({
    type: UPDATE_LEAD,
    payload: lead,
  });
  
  export const updateLeadSuccess = lead => ({
    type: UPDATE_LEAD_SUCCESS,
    payload: lead,
  });
  
  export const updateLeadFail = error => ({
    type: UPDATE_LEAD_FAIL,
    payload: error,
  });
  
  export const addNewLead = lead => ({
    type: ADD_NEW_LEAD,
    payload: lead,
  });
  
  export const addLeadSuccess = lead => ({
    type: ADD_LEAD_SUCCESS,
    payload: lead,
  });
  
  export const addLeadFail = error => ({
    type: ADD_LEAD_FAIL,
    payload: error,
  });
  
  export const deleteLead = lead => ({
    type: DELETE_LEAD,
    payload: lead,
  });
  
  export const deleteLeadSuccess = lead => ({
    type: DELETE_LEAD_SUCCESS,
    payload: lead,
  });
  
  export const deleteLeadFail = error => ({
    type: DELETE_LEAD_FAIL,
    payload: error,
  });