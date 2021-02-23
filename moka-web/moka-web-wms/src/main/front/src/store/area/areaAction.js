import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'area/CLEAR_STORE';
export const CLEAR_TREE = 'area/CLEAR_TREE';
export const clearStore = createAction(CLEAR_STORE);
export const clearTree = createAction(CLEAR_TREE);

/**
 * 편집영역 트리 조회(페이지편집용)
 */
export const [GET_AREA_TREE, GET_AREA_TREE_SUCCESS, GET_AREA_TREE_FAILURE] = createRequestActionTypes('area/GET_AREA_TREE');
export const getAreaTree = createAction(GET_AREA_TREE, ({ search, callback }) => ({ search, callback }));

/**
 * 편집영역 트리 정렬
 */
export const PUT_AREA_LIST_SORT = 'area/PUT_AREA_LIST_SORT';
export const putAreaListSort = createAction(PUT_AREA_LIST_SORT, ({ parentAreaSeq, areaSeqList, callback }) => ({ parentAreaSeq, areaSeqList, callback }));

/**
 * 모달 데이터 조회
 */
export const GET_AREA_LIST_MODAL = 'area/GET_AREA_LIST_MODAL';
export const getAreaListModal = createAction(GET_AREA_LIST_MODAL, ({ search, callback }) => ({ search, callback }));
export const GET_AREA_MODAL = 'area/GET_AREA_MODAL';
export const getAreaModal = createAction(GET_AREA_MODAL, ({ areaSeq, callback }) => ({ areaSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_INVALID_LIST = 'area/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);
export const CHANGE_SELECTED_DEPTH = 'area/CHANGE_SELECTED_DEPTH';
export const changeSelectedDepth = createAction(CHANGE_SELECTED_DEPTH, (depth) => depth);

/**
 * 저장
 */
export const SAVE_AREA = 'area/SAVE_AREA';
export const saveArea = createAction(SAVE_AREA, ({ area, callback }) => ({ area, callback }));

/**
 * 삭제
 */
export const [DELETE_AREA, DELETE_AREA_SUCCESS] = createRequestActionTypes('area/DELETE_AREA');
export const deleteArea = createAction(DELETE_AREA, ({ areaSeq, callback, depth }) => ({ areaSeq, callback, depth }));
