import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'columnist/CLEAR_STORE';
export const CLEAR_COLUMNIST = 'columnist/CLEAR_COLUMNIST';
export const CLEAR_SEARCH_OPTION = 'columnist/CLEAR_SEARCH_OPTION';
export const clearStore = createAction(CLEAR_STORE);
export const clearColumnist = createAction(CLEAR_COLUMNIST);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION, (search) => search);

/**
 * 데이터 변경
 */
export const CHANGE_SEARCH_OPTION = 'columnist/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const CHANGE_INVALID_LINK = 'columnNist/CHANGE_INVALID_LINK';
export const changeInvalidList = createAction(CHANGE_INVALID_LINK, (invalidList) => invalidList);

/**
 * 데이터 조회
 */
export const [GET_COLUMNIST_LIST, GET_COLUMNIST_LIST_SUCCESS, GET_COLUMNIST_LIST_FAILURE] = createRequestActionTypes('columnist/GET_COLUMNIST_LIST');
export const [GET_COLUMNIST, GET_COLUMNIST_SUCCESS, GET_COLUMNIST_FAILURE] = createRequestActionTypes('columnist/GET_COLUMNIST');
export const getColumnistList = createAction(GET_COLUMNIST_LIST, ({ search, callback }) => ({ search, callback }));
export const getColumnist = createAction(GET_COLUMNIST, ({ seqNo, callback }) => ({ seqNo, callback }));

/**
 * 데이터 조회(모달)
 */
export const GET_COLUMNIST_LIST_MODAL = 'columnist/GET_COLUMNIST_LIST_MODAL';
export const getColumnistListModal = createAction(GET_COLUMNIST_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 칼럼니스트 저장
 */
export const SAVE_COLUMNIST = 'columnNist/SAVE_COLUMNIST';
export const saveColumnist = createAction(SAVE_COLUMNIST, ({ columnist, callback }) => ({ columnist, callback }));
