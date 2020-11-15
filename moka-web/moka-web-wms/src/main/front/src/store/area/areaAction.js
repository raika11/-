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
export const CLEAR_LIST = 'area/CLEAR_LIST';
export const CLEAR_TREE = 'area/CLEAR_TREE';
export const clearStore = createAction(CLEAR_STORE);
export const clearArea = createAction(CLEAR_AREA, (depth) => depth);
export const clearList = createAction(CLEAR_LIST, (depth) => depth);
export const clearTree = createAction(CLEAR_TREE);

/**
 * 데이터 조회
 */
export const [GET_AREA_LIST_DEPTH1, GET_AREA_LIST_DEPTH1_SUCCESS, GET_AREA_LIST_DEPTH1_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH1');
export const [GET_AREA_LIST_DEPTH2, GET_AREA_LIST_DEPTH2_SUCCESS, GET_AREA_LIST_DEPTH2_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH2');
export const [GET_AREA_LIST_DEPTH3, GET_AREA_LIST_DEPTH3_SUCCESS, GET_AREA_LIST_DEPTH3_FAILURE] = createRequestActionTypes('area/GET_AREA_LIST_DEPTH3');
export const getAreaListDepth1 = createAction(GET_AREA_LIST_DEPTH1, (...actions) => actions);
export const getAreaListDepth2 = createAction(GET_AREA_LIST_DEPTH2, (...actions) => actions);
export const getAreaListDepth3 = createAction(GET_AREA_LIST_DEPTH3, (...actions) => actions);
export const [GET_AREA_DEPTH1, GET_AREA_DEPTH1_SUCCESS, GET_AREA_DEPTH1_FAILURE] = createRequestActionTypes('area/GET_AREA_DEPTH1');
export const [GET_AREA_DEPTH2, GET_AREA_DEPTH2_SUCCESS, GET_AREA_DEPTH2_FAILURE] = createRequestActionTypes('area/GET_AREA_DEPTH2');
export const [GET_AREA_DEPTH3, GET_AREA_DEPTH3_SUCCESS, GET_AREA_DEPTH3_FAILURE] = createRequestActionTypes('area/GET_AREA_DEPTH3');
export const getAreaDepth1 = createAction(GET_AREA_DEPTH1, ({ areaSeq }) => ({ areaSeq }));
export const getAreaDepth2 = createAction(GET_AREA_DEPTH2, ({ areaSeq }) => ({ areaSeq }));
export const getAreaDepth3 = createAction(GET_AREA_DEPTH3, ({ areaSeq }) => ({ areaSeq }));
export const GET_AREA_FAILURE = 'area/GET_AREA_FAILURE';

/**
 * 편집영역 트리 조회(페이지편집용)
 */
export const [GET_AREA_TREE, GET_AREA_TREE_SUCCESS, GET_AREA_TREE_FAILURE] = createRequestActionTypes('area/GET_AREA_TREE');
export const getAreaTree = createAction(GET_AREA_TREE, ({ search, callback }) => ({ search, callback }));

/**
 * 모달 데이터 조회
 */
export const [GET_AREA_LIST_MODAL] = createRequestActionTypes('area/GET_AREA_LIST_MODAL');
export const getAreaListModal = createAction(GET_AREA_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_AREA = 'area/CHANGE_AREA';
export const CHANGE_INVALID_LIST = 'area/CHANGE_INVALID_LIST';
export const changeArea = createAction(CHANGE_AREA, ({ area, depth }) => ({ area, depth }));
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);
export const CHANGE_SELECTED_DEPTH = 'area/CHANGE_SELECTED_DEPTH';
export const changeSelectedDepth = createAction(CHANGE_SELECTED_DEPTH, (depth) => depth);

/**
 * 저장
 */
export const [SAVE_AREA, SAVE_AREA_SUCCESS] = createRequestActionTypes('area/SAVE_AREA');
export const saveArea = createAction(SAVE_AREA, ({ actions, callback, depth }) => ({ actions, callback, depth }));

/**
 * 삭제
 */
export const [DELETE_AREA, DELETE_AREA_SUCCESS] = createRequestActionTypes('area/DELETE_AREA');
export const deleteArea = createAction(DELETE_AREA, ({ areaSeq, callback, depth }) => ({ areaSeq, callback, depth }));
