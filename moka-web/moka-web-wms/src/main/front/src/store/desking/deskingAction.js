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
 * componentWorkList 데이터 조회
 */
export const [GET_COMPONENT_WORK_LIST, GET_COMPONENT_WORK_LIST_SUCCESS, GET_COMPONENT_WORK_LIST_FAILURE] = createRequestActionTypes('desking/GET_COMPONENT_WORK_LIST');
export const getComponentWorkList = createAction(GET_COMPONENT_WORK_LIST, ({ areaSeq, callback }) => ({ areaSeq, callback }));

/**
 * deskingWorkList 저장
 * (워크의 기사리스트)
 */
export const [POST_DESKING_WORK_LIST, POST_DESKING_WORK_LIST_SUCCESS, POST_DESKING_WORK_LIST_FAILURE] = createRequestActionTypes('desking/POST_DESKING_WORK_LIST');
export const postDeskingWorkList = createAction(POST_DESKING_WORK_LIST, ({ componentWorkSeq, datasetSeq, list, callback }) => ({
    componentWorkSeq,
    datasetSeq,
    list,
    callback,
}));

/**
 * 편집영역 데이터 변경
 */
export const CHANGE_AREA = 'desking/CHANGE_AREA';
export const changeArea = createAction(CHANGE_AREA, (area) => area);

/**
 * 데스킹 드래그스탑
 */
export const DESKING_DRAG_STOP = 'desking/DESKING_DRAG_STOP';
export const deskingDragStop = createAction(DESKING_DRAG_STOP, ({ source, target, component }) => ({ source, target, component }));

/**
 * 데스킹워크 정렬
 */
export const DESKING_SORT_GRID = 'desking/DESKING_SORT_GRID';
export const deskingSortGrid = createAction(DESKING_SORT_GRID, ({ grid, component }) => ({ grid, component }));
