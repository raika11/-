import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'comment/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

// 차단 메뉴 구분값 처리.
export const INITIALIZE_BANNED_PARAMS = 'comment/INITIALIZE_BANNED_PARAMS';
export const initializeBannedParams = createAction(INITIALIZE_BANNED_PARAMS);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'comment/CLEAR_COMMENT_ALL';
export const CLEAR_COMMENT = 'comment/CLEAR_COMMENT';
export const CLEAR_LIST = 'comment/CLEAR_LIST';
export const CLEAR_SEARCH = 'comment/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearComment = createAction(CLEAR_COMMENT);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_COMMENT_LIST, GET_COMMENT_LIST_SUCCESS, GET_COMMENT_LIST_FAILURE] = createRequestActionTypes('comment/GET_COMMENT_LIST');
export const getCommentList = createAction(GET_COMMENT_LIST, (...actions) => actions);

/**
 * 데이터 변경
 */
export const CHANGE_COMMENT = 'comment/CHANGE_COMMENT';
export const CHANGE_INVALID_LIST = 'comment/CHANGE_INVALID_LIST';
export const changeComment = createAction(CHANGE_COMMENT, (comment) => comment);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 차단 저장
 */
export const SAVE_BLOCK = 'comment/SAVE_BLOCK';
export const saveBlock = createAction(SAVE_BLOCK, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 삭제
 */
export const [DELETE_COMMENT, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE] = createRequestActionTypes('comment/DELETE_COMMENT');
export const deleteComment = createAction(DELETE_COMMENT, ({ commentSeq, callback }) => ({ commentSeq, callback }));
