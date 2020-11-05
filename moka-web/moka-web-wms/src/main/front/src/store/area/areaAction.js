import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION_DEPTH1 = 'area/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTION_DEPTH2 = 'area/CHANGE_SEARCH_OPTION_DEPTH2';
export const CHANGE_SEARCH_OPTION_DEPTH3 = 'area/CHANGE_SEARCH_OPTION_DEPTH3';
export const changeSearchOptionDepth1 = createAction(CHANGE_SEARCH_OPTION_DEPTH1, (search) => search);
export const changeSearchOptionDepth2 = createAction(CHANGE_SEARCH_OPTION_DEPTH2, (search) => search);
export const changeSearchOptionDepth3 = createAction(CHANGE_SEARCH_OPTION_DEPTH3, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'area/CLEAR_STORE';
export const CLEAR_AREA = 'area/CLEAR_AREA';
export const clearStore = createAction(CLEAR_STORE);
export const clearArea = createAction(CLEAR_AREA);

/**
 * 데이터 조회
 */
export const [GET_AREA_LIST_DEPTH1, GET_AREA_LIST_DEPTH1_SUCCESS, GET_AREA_LIST_DEPTH1_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH1');
export const [GET_AREA_LIST_DEPTH2, GET_AREA_LIST_DEPTH2_SUCCESS, GET_AREA_LIST_DEPTH2_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH2');
export const [GET_AREA_LIST_DEPTH3, GET_AREA_LIST_DEPTH3_SUCCESS, GET_AREA_LIST_DEPTH3_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH3');
export const [GET_AREA, GET_AREA_SUCCESS, GET_AREA_FAILURE] = createRequestActionTypes('area/GET_AREA');
export const getAreaListDepth1 = createAction(GET_AREA_LIST_DEPTH1, (...actions) => actions);
export const getAreaListDepth2 = createAction(GET_AREA_LIST_DEPTH2, (...actions) => actions);
export const getAreaListDepth3 = createAction(GET_AREA_LIST_DEPTH3, (...actions) => actions);
export const getArea = createAction(GET_AREA, ({ areaSeq }) => ({ areaSeq }));

/**
 * 데이터 변경
 */
export const CHANGE_AREA = 'area/CHANGE_AREA';
export const CHANGE_INVALID_LIST = 'area/CHANGE_INVALID_LIST';
export const changeArea = createAction(CHANGE_AREA, (area) => area);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_AREA = 'area/SAVE_AREA';
export const saveArea = createAction(SAVE_AREA, ({ actions, callback }) => ({ actions, callback }));
