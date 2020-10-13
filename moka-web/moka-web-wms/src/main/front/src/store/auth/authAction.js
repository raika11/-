import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/createRequestSaga';

/**
 * action
 */

// 로그인
export const LOGIN_JWT = 'auth/loginJwt';

// 로그아웃
export const LOGOUT = 'auth/logout';

// 메뉴 조회
export const [GET_MENU, GET_MENU_SUCCESS, GET_MENU_FAILURE] = createRequestActionTypes('auth/GET_MENU');

// 매체 조회
export const [GET_MEDIAS, GET_MEDIAS_SUCCESS, GET_MEDIAS_FAILURE] = createRequestActionTypes('auth/GET_MEDIAS');

// 매체에 따른 도메인 조회
export const [GET_DOMAINS, GET_DOMAINS_SUCCESS, GET_DOMAINS_FAILURE] = createRequestActionTypes('auth/GET_DOMAINS');
export const CHANGE_DOMAIN_SEARCH_OPTION = 'auth/CHANGE_DOMAIN_SEARCH_OPTION';

// 오픈 중인 domainId, mediaId 공유
export const CHANGE_LATEST_DOMAINID = 'auth/CHANGE_LATEST_DOMAINID';
export const CHANGE_LATEST_MEDIAID_RESULT = 'auth/CHANGE_LATEST_MEDIAID_RESULT';
export const CHANGE_LATEST_MEDIAID = 'auth/CHANGE_LATEST_MEDIAID';

// 개인 테마
export const SET_THEME = 'auth/SET_THEME';

/**
 * action creator
 */
export const loginJwt = createAction(LOGIN_JWT);
export const logout = createAction(LOGOUT);
export const getMenu = createAction(GET_MENU);
export const getMedias = createAction(GET_MEDIAS);
export const getDomains = createAction(GET_DOMAINS, (payload) => payload);
export const changeDomainSearchOption = createAction(CHANGE_DOMAIN_SEARCH_OPTION, ({ key, value }) => ({ key, value }));
export const changeLatestDomainId = createAction(CHANGE_LATEST_DOMAINID, (domainId) => domainId);
export const changeLatestMediaId = createAction(CHANGE_LATEST_MEDIAID, (payload) => payload);
export const setTheme = createAction(SET_THEME);
