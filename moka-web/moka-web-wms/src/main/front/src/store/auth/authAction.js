import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/createRequestSaga';

// 로그인
export const LOGIN_JWT = 'auth/loginJwt';

// 로그아웃
export const LOGOUT = 'auth/logout';

// 메뉴 조회
export const [GET_MENU, GET_MENU_SUCCESS, GET_MENU_FAILURE] = createRequestActionTypes('auth/GET_MENU');

// 전체 도메인 조회
export const [GET_DOMAIN_LIST, GET_DOMAIN_LIST_SUCCESS, GET_DOMAIN_LIST_FAILURE] = createRequestActionTypes('auth/GET_DOMAIN_LIST');
export const CHANGE_DOMAIN_SEARCH_OPTION = 'auth/CHANGE_DOMAIN_SEARCH_OPTION';

// 오픈 중인 domainId, mediaId 공유
export const CHANGE_LATEST_DOMAINID = 'auth/CHANGE_LATEST_DOMAINID';

/**
 * action creator
 */
export const loginJwt = createAction(LOGIN_JWT);
export const logout = createAction(LOGOUT);
export const getMenu = createAction(GET_MENU, (payload) => payload);
export const getDomainList = createAction(GET_DOMAIN_LIST);
export const changeDomainSearchOption = createAction(CHANGE_DOMAIN_SEARCH_OPTION, ({ key, value }) => ({ key, value }));
export const changeLatestDomainId = createAction(CHANGE_LATEST_DOMAINID, (domainId) => domainId);
