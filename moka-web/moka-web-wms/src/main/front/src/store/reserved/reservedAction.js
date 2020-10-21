import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 예약어 목록 조회 action
 */
export const [GET_RESERVED_LIST, GET_RESERVED_LIST_SUCCESS, GET_RESERVED_LIST_FAILURE] = createRequestActionTypes('reserved/GET_RESERVED_LIST');
export const getReservedList = createAction(GET_RESERVED_LIST, (...payload) => payload);

/**
 * 예약어 수정 action
 */
export const [PUT_RESERVED, PUT_RESERVED_SUCCESS, PUT_RESERVED_FAILURE] = createRequestActionTypes('reserved/PUT_RESERVED');
export const putReserved = createAction(PUT_RESERVED, (payload) => payload);

/**
 * 예약어 삭제 action
 */
export const [DELETE_RESERVED, DELETE_RESERVED_SUCCESS, DELETE_RESERVED_FAILURE] = createRequestActionTypes('reserved/DELETE_RESERVED');
export const deleteReserved = createAction(DELETE_RESERVED, (payload) => payload);

/**
 * 예약어 상세 조회 action
 */
export const [GET_RESERVED, GET_RESERVED_SUCCESS, GET_RESERVED_FAILURE] = createRequestActionTypes('reserved/GET_RESERVED');
export const getReserved = createAction(GET_RESERVED, (payload) => payload);

/**
 * stroe 데이터 clear action
 */
export const CLEAR_RESERVED = 'reserved/CLEAR_RESERVED';
export const CLEAR_RESERVED_LIST = 'reserved/CLEAR_RESERVED_LIST';
export const CLEAR_SEARCH_OPTION = 'reserved/CLEAR_SEARCH_OPTION';
export const clearReserved = createAction(CLEAR_RESERVED, (payload) => payload);
export const clearReservedList = createAction(CLEAR_RESERVED_LIST);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);

/**
 * 검색 조건 변경 action
 */
export const CHANGE_SEARCH_OPTION = 'reserved/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
