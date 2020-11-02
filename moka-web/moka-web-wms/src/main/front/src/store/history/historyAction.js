import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'history/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'history/CLEAR_STORE';
export const CLEAR_HISTORY = 'history/CLEAR_HISTORY';
export const CLEAR_LIST = 'history/CLEAR_LIST';
export const CLEAR_SEARCH = 'history/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearHistory = createAction(CLEAR_HISTORY);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_HISTORY_LIST, GET_HISTORY_LIST_SUCCESS, GET_HISTORY_LIST_FAILURE] = createRequestActionTypes('history/GET_HISTORY_LIST');
export const [GET_HISTORY, GET_HISTORY_SUCCESS, GET_HISTORY_FAILURE] = createRequestActionTypes('history/GET_HISTORY');
export const getHistoryList = createAction(GET_HISTORY_LIST, (...actions) => actions);
export const getHistory = createAction(GET_HISTORY, ({ seq, search, callback }) => ({ seq, search, callback }));
