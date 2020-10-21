import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'domain/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'domain/CLEAR_DOMAIN_ALL';
export const CLEAR_DOMAIN = 'domain/CLEAR_DOMAIN';
export const CLEAR_LIST = 'domain/CLEAR_LIST';
export const CLEAR_SEARCH = 'domain/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearDomain = createAction(CLEAR_DOMAIN);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_DOMAIN_LIST, GET_DOMAIN_LIST_SUCCESS, GET_DOMAIN_LIST_FAILURE] = createRequestActionTypes('domain/GET_DOMAIN_LIST');
export const [GET_DOMAIN, GET_DOMAIN_SUCCESS, GET_DOMAIN_FAILURE] = createRequestActionTypes('domain/GET_DOMAIN');
export const getDomainList = createAction(GET_DOMAIN_LIST, (...actions) => actions);
export const getDomain = createAction(GET_DOMAIN, (domainId) => domainId);
export const HAS_RELATIONS = 'domain/HAS_RELATIONS';
export const hasRelations = createAction(HAS_RELATIONS, ({ domainId, callback }) => ({ domainId, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_DOMAIN = 'domain/CHANGE_DOMAIN';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
export const changeDomain = createAction(CHANGE_DOMAIN, (domain) => domain);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 중복체크
 */
export const DUPLICATE_CHECK = 'domain/DUPLICATE_CHECK';
export const duplicateCheck = createAction(DUPLICATE_CHECK, ({ domainId, callback }) => ({ domainId, callback }));

/**
 * 저장
 */
export const SAVE_DOMAIN = 'domain/SAVE_DOMAIN';
export const saveDomain = createAction(SAVE_DOMAIN, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 삭제
 */
export const [DELETE_DOMAIN, DELETE_DOMAIN_SUCCESS, DELETE_DOMAIN_FAILURE] = createRequestActionTypes('domain/DELETE_DOMAIN');
export const deleteDomain = createAction(DELETE_DOMAIN, ({ domainId, callback }) => ({ domainId, callback }));
