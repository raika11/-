import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/createRequestSaga';
/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'domain/CHANGE_SEARCH_OPTION';
export const CLEAR_SEARCH_OPTION = 'domain/CLEAR_SEARCH_OPTION';
export const CLEAR_DOMAIN = 'domain/CLEAR_DOMAIN';
export const CLEAR_DOMAIN_LIST = 'domain/CLEAR_DOMAIN_LIST';
export const CLEAR_DOMAIN_DETAIL = 'domain/CLEAR_DOMAIN_DETAIL';
export const DUPLICATE_CHECK = 'domain/DUPLICATE_CHECK';
export const [GET_DOMAINS, GET_DOMAINS_SUCCESS, GET_DOMAINS_FAILURE] = createRequestActionTypes('domain/GET_DOMAINS');
export const [GET_DOMAIN, GET_DOMAIN_SUCCESS, GET_DOMAIN_FAILURE] = createRequestActionTypes('domain/GET_DOMAIN');
export const SAVE_DOMAIN = 'domain/SAVE_DOMAIN';
export const HAS_RELATIONS = 'domain/HAS_RELATIONS';
export const [DELETE_DOMAIN, DELETE_DOMAIN_SUCCESS, DELETE_DOMAIN_FAILURE] = createRequestActionTypes('domain/DELETE_DOMAIN');

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const clearDomain = createAction(CLEAR_DOMAIN, (payload) => payload);
export const clearDomainList = createAction(CLEAR_DOMAIN_LIST);
export const clearDomainDetail = createAction(CLEAR_DOMAIN_DETAIL);
export const duplicateCheck = createAction(DUPLICATE_CHECK, (payload) => payload);
export const getDomains = createAction(GET_DOMAINS, (...actions) => actions);
export const getDomain = createAction(GET_DOMAIN, (payload) => payload);
export const saveDomain = createAction(SAVE_DOMAIN, (payload) => payload);
export const hasRelations = createAction(HAS_RELATIONS, (payload) => payload);
export const deleteDomain = createAction(DELETE_DOMAIN, (payload) => payload);
