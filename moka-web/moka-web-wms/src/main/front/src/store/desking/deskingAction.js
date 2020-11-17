import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'desking/CLEAR_STORE';
export const CLEAR_LIST = 'desking/CLEAR_LIST';
export const clearStore = createAction(CLEAR_STORE);
export const clearList = createAction(CLEAR_LIST);

/**
 * 데이터 조회
 */
export const [GET_COMPONENT_WORK_LIST, GET_COMPONENT_WORK_LIST_SUCCESS, GET_COMPONENT_WORK_LIST_FAILURE] = createRequestActionTypes('desking/GET_COMPONENT_WORK_LIST');
export const getComponentWorkList = createAction(GET_COMPONENT_WORK_LIST, ({ areaSeq, callback }) => ({ areaSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_AREA = 'desking/CHANGE_AREA';
export const changeArea = createAction(CHANGE_AREA, (area) => area);
