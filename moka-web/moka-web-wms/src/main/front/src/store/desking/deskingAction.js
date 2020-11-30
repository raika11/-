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
 * 컴포넌트 워크 목록 조회
 */
export const [GET_COMPONENT_WORK_LIST, GET_COMPONENT_WORK_LIST_SUCCESS, GET_COMPONENT_WORK_LIST_FAILURE] = createRequestActionTypes('desking/GET_COMPONENT_WORK_LIST');
export const getComponentWorkList = createAction(GET_COMPONENT_WORK_LIST, ({ areaSeq, callback }) => ({ areaSeq, callback }));

/**
 * 컴포넌트 워크 조회
 */
export const GET_COMPONENT_WORK = 'desking/GET_COMPONENT_WORK';
export const getComponentWork = createAction(GET_COMPONENT_WORK, ({ componentWorkSeq, callback }) => ({ componentWorkSeq, callback }));

/**
 * 컴포넌트 워크 수정(스냅샷 제외)
 */
export const PUT_COMPONENT_WORK = 'desking/PUT_COMPONENT_WORK';
export const putComponentWork = createAction(PUT_COMPONENT_WORK, ({ componentWork, callback }) => ({
    componentWork,
    callback,
}));

/**
 * 컴포넌트 워크 스냅샷 수정
 */
export const PUT_SNAPSHOT_COMPONENT_WORK = 'desking/PUT_SNAPSHOT_COMPONENT_WORK';
export const putSnapshotComponentWork = createAction(PUT_SNAPSHOT_COMPONENT_WORK, ({ componentWorkSeq, snapshotYn, snapshotBody, callback }) => ({
    componentWorkSeq,
    snapshotYn,
    snapshotBody,
    callback,
}));

/**
 * 컴포넌트 워크의 편집기사 리스트 저장
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
 * Work컴포넌트 임시저장
 */
export const POST_SAVE_COMPONENT_WORK = 'desking/POST_SAVE_COMPONENT_WORK';
export const postSaveComponentWork = createAction(POST_SAVE_COMPONENT_WORK, ({ componentWorkSeq, callback }) => ({
    componentWorkSeq,
    callback,
}));

/**
 * Work컴포넌트 전송
 */
export const POST_PUBLISH_COMPONENT_WORK = 'desking/POST_PUBLISH_COMPONENT_WORK';
export const postPublishComponentWork = createAction(POST_PUBLISH_COMPONENT_WORK, ({ componentWorkSeq, callback }) => ({
    componentWorkSeq,
    callback,
}));

/**
 * Work컴포넌트 예약
 */
export const POST_RESERVE_COMPONENT_WORK = 'desking/POST_RESERVE_COMPONENT_WORK';
export const postReserveComponentWork = createAction(POST_RESERVE_COMPONENT_WORK, ({ componentWorkSeq, reserveDt, callback }) => ({
    componentWorkSeq,
    reserveDt,
    callback,
}));

/**
 * Work컴포넌트 순번수정
 */
// export const PUT_DESKING_WORK_PRIORITY = 'desking/PUT_DESKING_WORK_PRIORITY';
// export const putDeskingWorkPriority = createAction(PUT_DESKING_WORK_PRIORITY, ({ component, callback }) => ({
//     component,
//     callback,
// }));

/**
 * 공백 기사 추가
 */
export const POST_DESKING_WORK = 'desking/POST_DESKING_WORK';
export const postDeskingWork = createAction(POST_DESKING_WORK, ({ componentWorkSeq, datasetSeq, deskingWork, callback }) => ({
    componentWorkSeq,
    datasetSeq,
    deskingWork,
    callback,
}));

/**
 * 데스킹 워크 목록 이동
 */
export const [MOVE_DESKING_WORK_LIST, MOVE_DESKING_WORK_LIST_SUCCESS, MOVE_DESKING_WORK_LIST_FAILURE] = createRequestActionTypes('desking/MOVE_DESKING_WORK_LIST');
export const moveDeskingWorkList = createAction(MOVE_DESKING_WORK_LIST, ({ componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list, callback }) => ({
    componentWorkSeq,
    datasetSeq,
    srcComponentWorkSeq,
    srcDatasetSeq,
    list,
    callback,
}));

/**
 * 데스킹 워크 수정
 */
export const PUT_DESKING_WORK = 'desking/PUT_DESKING_WORK';
export const putDeskingWork = createAction(PUT_DESKING_WORK, ({ componentWorkSeq, deskingWork, callback }) => ({ componentWorkSeq, deskingWork, callback }));

/**
 *  work편집기사 삭제
 */
export const DELETE_DESKING_WORK_LIST = 'desking/DELETE_DESKING_WORK_LIST';
export const deleteDeskingWorkList = createAction(DELETE_DESKING_WORK_LIST, ({ componentWorkSeq, datasetSeq, list, callback }) => ({
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
export const deskingDragStop = createAction(DESKING_DRAG_STOP, ({ source, target, srcComponent, tgtComponent, callback }) => ({
    source,
    target,
    srcComponent,
    tgtComponent,
    callback,
}));

/**
 * 데스킹워크 정렬
 */
export const DESKING_SORT_GRID = 'desking/DESKING_SORT_GRID';
export const deskingSortGrid = createAction(DESKING_SORT_GRID, ({ grid, component }) => ({ grid, component }));

export const COMPONENT_WORK_SUCCESS = 'desking/COMPONENT_WORK_SUCCESS';
export const COMPONENT_WORK_FAILURE = 'desking/COMPONENT_WORK_FAILURE';
