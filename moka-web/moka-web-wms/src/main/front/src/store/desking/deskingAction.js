import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'desking/CLEAR_STORE';
export const CLEAR_LIST = 'desking/CLEAR_LIST';
export const CLEAR_HISTORY_LIST = 'desking/CLEAR_LIST';
export const CLEAR_DESKING_HISTORY_LIST = 'desking/CLEAR_DESKING_HISTORY_LIST';
export const CLEAR_SELECTED_COMPONENT = 'desking/CLEAR_SELECTED_COMPONENT';
export const clearStore = createAction(CLEAR_STORE);
export const clearList = createAction(CLEAR_LIST);
export const clearHistoryList = createAction(CLEAR_HISTORY_LIST);
export const clearDeskingHistoryList = createAction(CLEAR_DESKING_HISTORY_LIST);
export const clearSelectedComponent = createAction(CLEAR_SELECTED_COMPONENT);

/**
 * 검색조건 변경
 */
export const CHANGE_HISTORY_SEARCH_OPTION = 'desking/CHANGE_HISTORY_SEARCH_OPTION';
export const changeHistorySearchOption = createAction(CHANGE_HISTORY_SEARCH_OPTION, (search) => search);

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
 * 컴포넌트 워크 수정(템플릿만!)
 */
export const PUT_COMPONENT_WORK_TEMPLATE = 'desking/PUT_COMPONENT_WORK_TEMPLATE';
export const putComponentWorkTemplate = createAction(PUT_COMPONENT_WORK_TEMPLATE, ({ componentWorkSeq, templateSeq, callback }) => ({
    componentWorkSeq,
    templateSeq,
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
 * 컴포넌트 워크의 데스킹 워크(편집기사) 리스트 저장
 */
export const [POST_DESKING_WORK_LIST, POST_DESKING_WORK_LIST_SUCCESS, POST_DESKING_WORK_LIST_FAILURE] = createRequestActionTypes('desking/POST_DESKING_WORK_LIST');
export const postDeskingWorkList = createAction(POST_DESKING_WORK_LIST, ({ areaSeq, componentWorkSeq, datasetSeq, list, callback }) => ({
    areaSeq,
    componentWorkSeq,
    datasetSeq,
    list,
    callback,
}));

/**
 * 컴포넌트 워크의 status 변경
 */
export const CHANGE_WORK_STATUS = 'desking/CHANGE_WORK_STATUS';
export const changeWorkStatus = createAction(CHANGE_WORK_STATUS, ({ componentWorkSeq, status }) => ({
    componentWorkSeq,
    status,
}));

/**
 * 컴포넌트 워크 임시저장
 * templateSeq => 네이버채널 임시저장만 사용!!
 */
export const POST_SAVE_COMPONENT_WORK = 'desking/POST_SAVE_COMPONENT_WORK';
export const postSaveComponentWork = createAction(POST_SAVE_COMPONENT_WORK, ({ componentWorkSeq, templateSeq, callback }) => ({
    componentWorkSeq,
    templateSeq,
    callback,
}));

/**
 * 컴포넌트 워크 전송
 * templateSeq => 네이버채널 임시저장만 사용!!
 */
export const POST_PUBLISH_COMPONENT_WORK = 'desking/POST_PUBLISH_COMPONENT_WORK';
export const postPublishComponentWork = createAction(POST_PUBLISH_COMPONENT_WORK, ({ componentWorkSeq, areaSeq, templateSeq, callback }) => ({
    componentWorkSeq,
    areaSeq,
    templateSeq,
    callback,
}));

/**
 * 컴포넌트 워크 예약
 */
export const POST_RESERVE_COMPONENT_WORK = 'desking/POST_RESERVE_COMPONENT_WORK';
export const postReserveComponentWork = createAction(POST_RESERVE_COMPONENT_WORK, ({ componentWorkSeq, reserveDt, callback }) => ({
    componentWorkSeq,
    reserveDt,
    callback,
}));

/**
 * 컴포넌트 워크 예약 삭제
 */
export const DELETE_RESERVE_COMPONENT_WORK = 'desking/DELETE_RESERVE_COMPONENT_WORK';
export const deleteReserveComponentWork = createAction(DELETE_RESERVE_COMPONENT_WORK, ({ componentWorkSeq, callback }) => ({
    componentWorkSeq,
    callback,
}));

/**
 * 컴포넌트 워크 임시저장 + 전송 둘 다 하는 액션
 */
export const POST_SAVE_PUBLISH_COMPONENT_WORK = 'desking/POST_SAVE_PUBLISH_COMPONENT_WORK';
export const postSavePublishComponentWork = createAction(POST_SAVE_PUBLISH_COMPONENT_WORK, ({ componentWorkSeq, areaSeq, callback }) => ({
    componentWorkSeq,
    areaSeq,
    callback,
}));

/**
 * 컴포넌트 워크 순번수정
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
 * 데스킹 워크(편집기사) 목록 이동
 */
export const [POST_DESKING_WORK_LIST_MOVE, POST_DESKING_WORK_LIST_MOVE_SUCCESS, POST_DESKING_WORK_LIST_MOVE_FAILURE] = createRequestActionTypes(
    'desking/POST_DESKING_WORK_LIST_MOVE',
);
export const postDeskingWorkListMove = createAction(POST_DESKING_WORK_LIST_MOVE, ({ componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list, callback }) => ({
    componentWorkSeq,
    datasetSeq,
    srcComponentWorkSeq,
    srcDatasetSeq,
    list,
    callback,
}));

/**
 * 컴포넌트 워크의 기사목록 정렬(컴포넌트 내 정렬)
 */
export const [PUT_DESKING_WORK_LIST_SORT] = createRequestActionTypes('desking/PUT_DESKING_WORK_LIST_SORT');
export const putDeskingWorkListSort = createAction(PUT_DESKING_WORK_LIST_SORT, ({ componentWorkSeq, datasetSeq, list, callback }) => ({
    componentWorkSeq,
    datasetSeq,
    list,
    callback,
}));

/**
 * 데스킹 워크(편집기사) 수정
 */
export const PUT_DESKING_WORK = 'desking/PUT_DESKING_WORK';
export const putDeskingWork = createAction(PUT_DESKING_WORK, ({ areaSeq, componentWorkSeq, deskingWork, callback }) => ({ areaSeq, componentWorkSeq, deskingWork, callback }));

/**
 *  데스킹 워크(편집기사) 삭제
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
export const deskingDragStop = createAction(DESKING_DRAG_STOP, ({ source, target, srcComponent, tgtComponent, areaComp, callback }) => ({
    source,
    target,
    srcComponent,
    tgtComponent,
    areaComp,
    callback,
}));

/**
 * 데스킹 워크(편집기사) 정렬
 */
export const DESKING_SORT_GRID = 'desking/DESKING_SORT_GRID';
export const deskingSortGrid = createAction(DESKING_SORT_GRID, ({ grid, component }) => ({ grid, component }));

/**
 * 히스토리
 */
export const [GET_COMPONENT_WORK_HISTORY, GET_COMPONENT_WORK_HISTORY_SUCCESS, GET_COMPONENT_WORK_HISTORY_FAILURE] = createRequestActionTypes('desking/GET_COMPONENT_WORK_HISTORY');
export const [GET_DESKING_WORK_HISTORY, GET_DESKING_WORK_HISTORY_SUCCESS, GET_DESKING_WORK_HISTORY_FAILURE] = createRequestActionTypes('desking/GET_DESKING_WORK_HISTORY');
export const PUT_DESKING_WORK_HISTORY = 'desking/PUT_DESKING_WORK_HISTORY';
export const getComponentWorkHistory = createAction(GET_COMPONENT_WORK_HISTORY, ({ search, callback }) => ({ search, callback }));
export const getDeskingWorkHistory = createAction(GET_DESKING_WORK_HISTORY, ({ componentHistSeq }) => ({ componentHistSeq }));
export const putDeskingWorkHistory = createAction(PUT_DESKING_WORK_HISTORY, ({ componentWorkSeq, componentHistSeq, updateTemplateYn, callback }) => ({
    componentWorkSeq,
    componentHistSeq,
    updateTemplateYn,
    callback,
}));

export const COMPONENT_WORK_SUCCESS = 'desking/COMPONENT_WORK_SUCCESS';
export const COMPONENT_WORK_FAILURE = 'desking/COMPONENT_WORK_FAILURE';
