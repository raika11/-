import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'special/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const CHANGE_INVALID_LIST = 'special/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'special/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

/**
 * 데이터 조회
 */
export const [GET_SPECIAL_LIST, GET_SPECIAL_LIST_SUCCESS, GET_SPECIAL_LIST_FAILURE] = createRequestActionTypes('special/GET_SPECIAL_LIST');
export const getSpecialList = createAction(GET_SPECIAL_LIST, (...actions) => actions);
export const [GET_SPECIAL, GET_SPECIAL_SUCCESS, GET_SPECIAL_FAILURE] = createRequestActionTypes('special/GET_SPECIAL');
export const getTemplate = createAction(GET_SPECIAL, ({ seqNo, callback }) => ({ seqNo, callback }));
