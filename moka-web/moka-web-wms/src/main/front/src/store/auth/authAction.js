import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 로그인
export const LOGIN_JWT = 'auth/LOGIN_JWT';
export const loginJwt = createAction(LOGIN_JWT);

// 로그아웃
export const LOGOUT = 'auth/LOGOUT';
export const logout = createAction(LOGOUT);

// BackOffice 유저 정보 조회
export const GET_BACK_OFFICE_USER = 'auth/GET_BACK_OFFICE_USER';
export const getBackOfficeUser = createAction(GET_BACK_OFFICE_USER);

// 그룹웨어 유저 정보 조회
export const GET_GROUP_WARE_USER = 'auth/GET_GROUP_WARE_USER';
export const getGroupWareUser = createAction(GET_GROUP_WARE_USER);

// SMS인증문자 요청
export const GET_SMS_REQUEST = 'auth/GET_SMS_REQUEST';
export const getSmsRequest = createAction(GET_SMS_REQUEST);

// 관리자 해제 요청
export const UNLOCK_SMS = 'auth/UNLOCK_REQUEST';
export const unlockRequest = createAction(UNLOCK_SMS);

// 본인인증 해제
export const UNLOCK_REQUEST = 'auth/UNLOCK_SMS';
export const approvalRequest = createAction(UNLOCK_SMS);

// 메뉴 조회
export const [GET_USER_MENU_TREE, GET_USER_MENU_TREE_SUCCESS, GET_USER_MENU_TREE_FAILURE] = createRequestActionTypes('auth/GET_USER_MENU_TREE');
export const getUserMenuTree = createAction(GET_USER_MENU_TREE, (pathName) => pathName);
// 메뉴 ID 저장
export const CHANGE_LATEST_MENUID = 'auth/CHANGE_LATEST_MENUID';
export const changeLatestMenuId = createAction(CHANGE_LATEST_MENUID, (menuId) => menuId);

// 전체 도메인 조회
export const [GET_DOMAIN_LIST, GET_DOMAIN_LIST_SUCCESS, GET_DOMAIN_LIST_FAILURE] = createRequestActionTypes('auth/GET_DOMAIN_LIST');
export const CHANGE_DOMAIN_SEARCH_OPTION = 'auth/CHANGE_DOMAIN_SEARCH_OPTION';
export const getDomainList = createAction(GET_DOMAIN_LIST);
export const changeDomainSearchOption = createAction(CHANGE_DOMAIN_SEARCH_OPTION, ({ key, value }) => ({ key, value }));

// 오픈 중인 domainId 공유
export const CHANGE_LATEST_DOMAINID = 'auth/CHANGE_LATEST_DOMAINID';
export const changeLatestDomainId = createAction(CHANGE_LATEST_DOMAINID, (domainId) => domainId);
