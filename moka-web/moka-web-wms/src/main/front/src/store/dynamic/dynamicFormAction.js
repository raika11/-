import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'dynamic/CLEAR_DYNAMIC_ALL';
export const CLEAR_DYNAMIC = 'dynamic/CLEAR_DYNAMIC';
export const CLEAR_LIST = 'dynamic/CLEAR_LIST';
export const CLEAR_SEARCH = 'dynamic/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearDynamicForm = createAction(CLEAR_DYNAMIC);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_DYNAMIC_LIST, GET_DYNAMIC_LIST_SUCCESS, GET_DYNAMIC_LIST_FAILURE] = createRequestActionTypes('dynamic/GET_DYNAMIC_LIST');
export const [GET_DYNAMIC, GET_DYNAMIC_SUCCESS, GET_DYNAMIC_FAILURE] = createRequestActionTypes('dynamic/GET_DYNAMIC');
export const getDynamicFormList = createAction(GET_DYNAMIC_LIST, (...actions) => actions);
export const getDynamicForm = createAction(GET_DYNAMIC, (partId) => partId);

/**
 * 데이터 변경
 */
export const CHANGE_DYNAMIC = 'dynamic/CHANGE_DYNAMIC';
export const CHANGE_INVALID_LIST = 'dynamic/CHANGE_INVALID_LIST';
export const changeDynamicForm = createAction(CHANGE_DYNAMIC, (dynamic) => dynamic);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_DYNAMIC = 'dynamic/SAVE_DYNAMIC';
export const saveDynamicForm = createAction(SAVE_DYNAMIC, ({ type, channelId, actions, callback }) => ({ type, channelId, actions, callback }));

/**
 * 삭제
 */
export const [DELETE_DYNAMIC, DELETE_DYNAMIC_SUCCESS, DELETE_DYNAMIC_FAILURE] = createRequestActionTypes('dynamic/DELETE_DYNAMIC');
export const deleteDynamicForm = createAction(DELETE_DYNAMIC, ({ partId, callback }) => ({ partId, callback }));
