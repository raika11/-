import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'internalApi/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const CHANGE_INVALID_LIST = 'internalApi/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'internalApi/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_INTERNAL_API = 'internalApi/CLEAR_INTERNAL_API';
export const clearInternalApi = createAction(CLEAR_INTERNAL_API);

/**
 * api 목록 조회
 */
export const [GET_INTERNAL_API_LIST, GET_INTERNAL_API_LIST_SUCCESS, GET_INTERNAL_API_LIST_FAILURE] = createRequestActionTypes('internalApi/GET_INTERNAL_API_LIST');
export const getInternalApiList = createAction(GET_INTERNAL_API_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * api 조회
 */
export const [GET_INTERNAL_API, GET_INTERNAL_API_SUCCESS, GET_INTERNAL_API_FAILURE] = createRequestActionTypes('internalApi/GET_INTERNAL_API');
export const getInternalApi = createAction(GET_INTERNAL_API, ({ seqNo, callback }) => ({ seqNo, callback }));

/**
 * api 저장
 */
export const [SAVE_INTERNAL_API, SAVE_INTERNAL_API_SUCCESS, SAVE_INTERNAL_API_FAILURE] = createRequestActionTypes('internalApi/SAVE_INTERNAL_API');
export const saveInternalApi = createAction(SAVE_INTERNAL_API, ({ internalApi, callback }) => ({ internalApi, callback }));

/**
 * api 삭제
 */
export const DELETE_INTERNAL_API = 'internalApi/DELETE_INTERNAL_API';
export const deleteInternalApi = createAction(DELETE_INTERNAL_API, ({ seqNo, callback }) => ({ seqNo, callback }));
