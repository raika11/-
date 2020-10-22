import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 예약어 목록 조회 action
 */
export const [GET_RESERVED_LIST, GET_RESERVED_LIST_SUCCESS, GET_RESERVED_LIST_FAILURE] = createRequestActionTypes('reserved/GET_RESERVED_LIST');
export const getReservedList = createAction(GET_RESERVED_LIST, (...payload) => payload);

/**
 * 예약어 저장 action
 */
export const SAVE_RESERVED = 'reserved/SAVE_RESERVED';
export const saveReserved = createAction(SAVE_RESERVED, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 예약어 삭제 action
 */
export const [DELETE_RESERVED, DELETE_RESERVED_SUCCESS, DELETE_RESERVED_FAILURE] = createRequestActionTypes('reserved/DELETE_RESERVED');
export const deleteReserved = createAction(DELETE_RESERVED, ({ reservedSeq, callback }) => ({ reservedSeq, callback }));

/**
 * 예약어 상세 조회 action
 */
export const [GET_RESERVED, GET_RESERVED_SUCCESS, GET_RESERVED_FAILURE] = createRequestActionTypes('reserved/GET_RESERVED');
export const getReserved = createAction(GET_RESERVED, (reservedSeq) => reservedSeq);

/**
 * store 데이터 clear action
 */
export const CLEAR_STORE = 'reserved/CLEAR_RESERVED_ALL';
export const CLEAR_RESERVED = 'reserved/CLEAR_RESERVED';
export const CLEAR_LIST = 'reserved/CLEAR_LIST';
export const CLEAR_SEARCH = 'reserved/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearReserved = createAction(CLEAR_RESERVED);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 검색 조건 변경 action
 */
export const CHANGE_SEARCH_OPTION = 'reserved/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 데이터 변경 action
 */
export const CHANGE_RESERVED = 'reserved/CHANGE_DOMAIN';
export const CHANGE_INVALID_LIST = 'reserved/CHANGE_INVALID_LIST';
export const changeReserved = createAction(CHANGE_RESERVED, (reserved) => reserved);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);
