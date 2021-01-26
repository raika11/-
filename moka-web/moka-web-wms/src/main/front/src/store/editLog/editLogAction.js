import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'editLog/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'editLog/CLEAR_STORE';
export const CLEAR_EDIT_LOG = 'editLog/CLEAR_EDIT_LOG';
export const clearStore = createAction(CLEAR_STORE);
export const clearEditLog = createAction(CLEAR_EDIT_LOG);

/**
 * 데이터 조회
 */
export const [GET_EDIT_LOG_LIST, GET_EDIT_LOG_LIST_SUCCESS, GET_EDIT_LOG_LIST_FAILURE] = createRequestActionTypes('editLog/GET_EDIT_LOG_LIST');
export const getEditLogList = createAction(GET_EDIT_LOG_LIST, ({ search, callback }) => ({ search, callback }));
export const [GET_EDIT_LOG, GET_EDIT_LOG_SUCCESS] = createRequestActionTypes('editLog/GET_EDIT_LOG');
export const getEditLog = createAction(GET_EDIT_LOG, ({ seqNo, callback }) => ({ seqNo, callback }));
