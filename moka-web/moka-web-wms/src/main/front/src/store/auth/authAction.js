import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 로그인
export const LOGIN_JWT = 'auth/LOGIN_JWT';
export const loginJwt = createAction(LOGIN_JWT);

// 로그아웃
export const LOGOUT = 'auth/LOGOUT';
export const logout = createAction(LOGOUT);

// 메뉴 조회
export const [GET_USER_MENU_TREE, GET_USER_MENU_TREE_SUCCESS, GET_USER_MENU_TREE_FAILURE] = createRequestActionTypes('auth/GET_USER_MENU_TREE');
export const getUserMenuTree = createAction(GET_USER_MENU_TREE, (payload) => payload);

// 전체 도메인 조회
export const [GET_DOMAIN_LIST, GET_DOMAIN_LIST_SUCCESS, GET_DOMAIN_LIST_FAILURE] = createRequestActionTypes('auth/GET_DOMAIN_LIST');
export const CHANGE_DOMAIN_SEARCH_OPTION = 'auth/CHANGE_DOMAIN_SEARCH_OPTION';
export const getDomainList = createAction(GET_DOMAIN_LIST);
export const changeDomainSearchOption = createAction(CHANGE_DOMAIN_SEARCH_OPTION, ({ key, value }) => ({ key, value }));

// 오픈 중인 domainId 공유
export const CHANGE_LATEST_DOMAINID = 'auth/CHANGE_LATEST_DOMAINID';
export const changeLatestDomainId = createAction(CHANGE_LATEST_DOMAINID, (domainId) => domainId);
