import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'member/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'member/CLEAR__ALL';
export const CLEAR_MEMBER = 'member/CLEAR_MEMBER';
export const CLEAR_LIST = 'member/CLEAR_LIST';
export const CLEAR_LOGIN_HISTORY_LIST = 'member/CLEAR_LOGIN_HISTORY_LIST';
export const CLEAR_SEARCH = 'member/CLEAR_SEARCH';
export const CLEAR_LOGIN_HISTORY_SEARCH = 'member/CLEAR_LOGIN_HISTORY_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearMember = createAction(CLEAR_MEMBER);
export const clearList = createAction(CLEAR_LIST);
export const clearHistoryList = createAction(CLEAR_LOGIN_HISTORY_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearLoginHistorySearch = createAction(CLEAR_LOGIN_HISTORY_SEARCH);

/**
 * 사용자 목록 조회
 */
export const [GET_MEMBER_LIST, GET_MEMBER_LIST_SUCCESS, GET_MEMBER_LIST_FAILURE] = createRequestActionTypes('member/GET_MEMBER_LIST');
export const [GET_MEMBER, GET_MEMBER_SUCCESS, GET_MEMBER_FAILURE] = createRequestActionTypes('member/GET_MEMBER');
export const getMemberList = createAction(GET_MEMBER_LIST, (...actions) => actions);
export const getMember = createAction(GET_MEMBER, (memberId) => memberId);

/**
 * 사용자 정보 변경
 */
export const CHANGE_MEMBER = 'member/CHANGE_MEMBER';
export const CHANGE_INVALID_LIST = 'member/CHANGE_INVALID_LIST';
export const changeMember = createAction(CHANGE_MEMBER, (member) => member);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 사용자 ID 중복체크
 */
export const DUPLICATE_CHECK = 'member/DUPLICATE_CHECK';
export const duplicateCheck = createAction(DUPLICATE_CHECK, ({ memberId, callback }) => ({ memberId, callback }));

/**
 * 저장
 */
export const SAVE_MEMBER = 'member/SAVE_MEMBER';
export const saveMember = createAction(SAVE_MEMBER, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 로그인 이력 검색조건 변경
 */
export const CHANGE_HISTORY_SEARCH_OPTION = 'member/CHANGE_HISTORY_SEARCH_OPTION';
export const changeHistorySearchOption = createAction(CHANGE_HISTORY_SEARCH_OPTION, (search) => search);

/**
 * 로그인 이력 조회
 */
export const [GET_LOGIN_HISTORY_LIST, GET_LOGIN_HISTORY_LIST_SUCCESS, GET_LOGIN_HISTORY_LIST_FAILURE] = createRequestActionTypes('member/GET_LOGIN_HISTORY_LIST');
export const getLoginHistoryList = createAction(GET_LOGIN_HISTORY_LIST, (...actions) => actions);
