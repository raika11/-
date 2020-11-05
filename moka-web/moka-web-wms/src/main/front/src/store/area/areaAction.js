import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'area/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'area/CLEAR_STORE';
export const CLEAR_AREA = 'area/CLEAR_AREA';
export const CLEAR_LIST = 'area/CLEAR_LIST';
export const CLEAR_SEARCH = 'area/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearArea = createAction(CLEAR_AREA);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_AREA_LIST, GET_AREA_LIST_SUCCESS, GET_AREA_LIST_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST');
export const [GET_AREA, GET_AREA_SUCCESS, GET_AREA_FAILURE] = createRequestActionTypes('area/GET_AREA');
export const getAreaList = createAction(GET_AREA_LIST, (...actions) => actions);
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
export const saveArea = createAction(SAVE_AREA, ({ area, callback }) => ({ area, callback }));
