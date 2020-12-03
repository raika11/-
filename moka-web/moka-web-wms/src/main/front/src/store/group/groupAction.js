import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'group/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'group/CLEAR_GROUP_ALL';
export const CLEAR_GROUP = 'group/CLEAR_GROUP';
export const CLEAR_LIST = 'group/CLEAR_LIST';
export const CLEAR_SEARCH = 'group/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearGroup = createAction(CLEAR_GROUP);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_GROUP_LIST, GET_GROUP_LIST_SUCCESS, GET_GROUP_LIST_FAILURE] = createRequestActionTypes('group/GET_GROUP_LIST');
export const [GET_GROUP, GET_GROUP_SUCCESS, GET_GROUP_FAILURE] = createRequestActionTypes('group/GET_GROUP');
export const getGroupList = createAction(GET_GROUP_LIST, (...actions) => actions);
export const getGroup = createAction(GET_GROUP, (groupCd) => groupCd);

/**
 * 중복체크
 */
export const DUPLICATE_GROUP_CHECK = 'group/DUPLICATE_GROUP_CHECK';
export const duplicateGroupCheck = createAction(DUPLICATE_GROUP_CHECK, ({ groupCd, callback }) => ({ groupCd, callback }));
export const HAS_RELATION_LIST = 'group/HAS_RELATION_LIST';
export const hasRelationList = createAction(HAS_RELATION_LIST, ({ groupCd, callback }) => ({ groupCd, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_GROUP = 'group/CHANGE_GROUP';
export const CHANGE_INVALID_LIST = 'group/CHANGE_INVALID_LIST';
export const changeGroup = createAction(CHANGE_GROUP, (group) => group);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_GROUP = 'group/SAVE_GROUP';
export const saveGroup = createAction(SAVE_GROUP, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 삭제
 */
export const [DELETE_GROUP, DELETE_GROUP_SUCCESS, DELETE_GROUP_FAILURE] = createRequestActionTypes('group/DELETE_GROUP');
export const deleteGroup = createAction(DELETE_GROUP, ({ groupCd, callback }) => ({ groupCd, callback }));

/**
 * 그룹 메뉴 권한 가져오기
 */
export const [GET_GROUP_MENU_AUTH, GET_GROUP_MENU_AUTH_SUCCESS, GET_GROUP_MENU_AUTH_FAILURE] = createRequestActionTypes('group/GET_GROUP_MENU_AUTH');
export const getGroupMenuAuth = createAction(GET_GROUP_MENU_AUTH, (groupCd) => groupCd);

export const CHANGE_GROUP_MENU_AUTH = 'group/CHANGE_GROUP_MENU_AUTH';
export const changeGroupMenuAuth = createAction(CHANGE_GROUP_MENU_AUTH, (changeInfo) => changeInfo);

export const UPDATE_GROUP_MENU_AUTH = 'group/SAVE_GROUP_MENU_AUTH';
export const updateGroupMenuAuth = createAction(UPDATE_GROUP_MENU_AUTH, ({ groupCd, changeMenuAuthList, callback }) => ({ groupCd, changeMenuAuthList, callback }));

export const CLEAR_GROUP_MENU_AUTH = 'group/CLEAR_GROUP_MENU_AUTH';
export const clearGroupMenuAuth = createAction(CLEAR_GROUP_MENU_AUTH);

export const [GET_GROUP_IN_MEMBER_LIST, GET_GROUP_IN_MEMBER_LIST_SUCCESS, GET_GROUP_IN_MEMBER_LIST_FAILURE] = createRequestActionTypes('group/GET_GROUP_IN_MEMBER_LIST');
export const getGroupInMemberList = createAction(GET_GROUP_IN_MEMBER_LIST);

export const [GET_SEARCH_MEMBER_LIST, GET_SEARCH_MEMBER_LIST_SUCCESS, GET_SEARCH_MEMBER_LIST_FAILURE] = createRequestActionTypes('group/GET_SEARCH_MEMBER_LIST');
export const getSearchMemberList = createAction(GET_SEARCH_MEMBER_LIST);

export const CHANGE_MEMBER_SEARCH_OPTION = 'group/CHANGE_MEMBER_SEARCH_OPTION';
export const changeMemberSearchOption = createAction(CHANGE_MEMBER_SEARCH_OPTION, ({ name, value }) => ({ name, value }));

export const UPDATE_GROUP_IN_MEMBER = 'group/UPDATE_GROUP_IN_MEMBER';
export const updateGroupInMember = createAction(UPDATE_GROUP_IN_MEMBER);

export const CLEAR_GROUP_MEMBER = 'group/CLEAR_GROUP_MEMBER';
export const clearGroupMember = createAction(CLEAR_GROUP_MEMBER);
