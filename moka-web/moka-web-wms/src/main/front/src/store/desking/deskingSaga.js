import { takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { getRowIndex } from '@utils/agGridUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './deskingApi';
import * as act from './deskingAction';

import { DEFAULT_LANG } from '@/constants';

/**
 * Desking API 호출
 * @param {string} actionType 액션명
 * @param {func} api API 함수
 */
export function createDeskingRequestSaga(actionType, api) {
    return function* (action) {
        const payload = action.payload;
        const { callback } = payload;
        let callbackData;

        yield put(startLoading(actionType));

        try {
            const response = yield call(api, action.payload);
            callbackData = { ...response.data, payload };

            if (response.data.header.success) {
                yield put({
                    type: act.COMPONENT_WORK_SUCCESS,
                    payload: response.data,
                });
            } else {
                yield put({
                    type: act.COMPONENT_WORK_FAILURE,
                    payload: response.data,
                });
            }
        } catch (e) {
            callbackData = errorResponse(e);
        }

        if (typeof callback === 'function') {
            yield call(callback, callbackData);
        }

        yield put(finishLoading(actionType));
    };
}

/**
 * 편집영역 클릭시, 컴포넌트 워크 목록 조회
 */
const getComponentWorkList = createRequestSaga(act.GET_COMPONENT_WORK_LIST, api.getComponentWorkList);

/**
 * 컴포넌트 워크 수정(스냅샷 제외)
 */
const putComponentWork = createDeskingRequestSaga(act.PUT_COMPONENT_WORK, api.putComponentWork);

/**
 * 컴포넌트 워크 스냅샷 수정
 */
const putSnapshotComponentWork = createRequestSaga(act.PUT_SNAPSHOT_COMPONENT_WORK, api.putSnapshotComponentWork, true);

/**
 * 데스킹 워크의 관련기사 rowNode 생성
 */
const makeRelRowNode = (data, relOrd, parentData, component) => {
    if (!parentData || parentData.totalId === null) {
        return { success: false, message: '올바른 주기사를 선택하세요' };
    }

    const existRow = parentData.relSeqs ? parentData.relSeqs.filter((relSeq) => relSeq === data.totalId) : null;
    if (existRow && existRow.length > 0) {
        return { success: false, message: '이미 존재하는 기사입니다' };
    }

    let appendData = null;

    if (data.gridType === 'ARTICLE') {
        appendData = {
            componentWorkSeq: component.seq,
            seq: null,
            deskingSeq: null,
            datasetSeq: component.datasetSeq,
            totalId: data.totalId,
            parentTotalId: parentData.totalId,
            contentType: data.contentType,
            artType: data.artType,
            sourceCode: data.sourceCode,
            contentOrd: parentData.contentOrd,
            relOrd,
            lang: DEFAULT_LANG,
            distDt: data.serviceDaytime,
            title: data.artEditTitle == null ? data.artTitle : data.artEditTitle,
            subTitle: data.artSubTitle,
            nameplate: null,
            titlePrefix: null,
            bodyHead: data.artSummary,
            linkUrl: null,
            linkTarget: null,
            moreUrl: null,
            moreTarget: null,
            thumbFileName: data.artThumb,
            rel: true,
            relSeqs: null,
        };
    }

    return { success: true, list: appendData };
};

/**
 * 데스킹 워크의 rowNode 생성
 */
const makeRowNode = (data, contentOrd, component, callback) => {
    if (!data || data.totalId === null) {
        return { success: false, message: '올바르지 않은 기사입니다' };
    }

    const existRow = component.deskingWorks.filter((desking) => desking.totalId === data.totalId);
    if (existRow && existRow.length > 0) {
        return { success: false, message: '이미 존재하는 기사입니다' };
    }

    let appendData = null;

    if (data.gridType === 'ARTICLE') {
        appendData = {
            componentWorkSeq: component.seq,
            seq: null,
            deskingSeq: null,
            datasetSeq: component.datasetSeq,
            totalId: data.totalId,
            parentTotalId: null, // 주기사일 경우 null, 관련기사일경우 주기사 키 지정.
            contentType: data.contentType,
            artType: data.artType,
            sourceCode: data.sourceCode,
            contentOrd: contentOrd,
            relOrd: 1,
            lang: DEFAULT_LANG,
            distDt: data.serviceDaytime,
            title: data.artEditTitle == null ? data.artTitle : data.artEditTitle,
            // mobTitle: data.artEditMobTitle == null ? data.artTitle : data.artEditTitle,
            subTitle: data.artSubTitle,
            nameplate: null,
            titlePrefix: null,
            bodyHead: data.artSummary,
            linkUrl: null,
            linkTarget: null,
            moreUrl: null,
            moreTarget: null,
            thumbFileName: data.artThumb,
            // thumbSize:,
            // thumbWidth:
            // thumbHeight:
            // regId:
            rel: false,
            relSeqs: null,
        };
    } else if (data.gridType === 'DESKING') {
        // 편집 컴포넌트영역 -> 편집컴포넌트 이동
        appendData = {
            ...data,
            regDt: undefined,
            componentWorkSeq: component.seq,
            componentSeq: component.componentSeq,
            datasetSeq: component.datasetSeq,
            contentOrd,
        };
    }

    return { success: true, list: appendData };
};

/**
 * 컴포넌트워크의 ag-grid row drag stop
 */
function* deskingDragStop({ payload }) {
    const { source, target, srcComponent, tgtComponent, callback } = payload;

    let overIndex = -1,
        addRelArt = false,
        sourceNode = null,
        appendNodes = [];

    if (target.overIndex) {
        overIndex = target.overIndex;
    } else if (source.event) {
        overIndex = getRowIndex(source.event);
    } else {
        // 마지막 row
        overIndex = target.api.getRenderedNodes().length - 1;
        overIndex = overIndex === 0 ? -1 : overIndex;
    }

    sourceNode = source.api.getSelectedNodes().length > 0 ? source.api.getSelectedNodes() : source.node;
    if (Array.isArray(sourceNode)) {
        // sourceNode 정렬 (childIndex 순으로)
        sourceNode = sourceNode.sort(function (a, b) {
            return a.childIndex - b.childIndex;
        });
    }

    // 주기사 추가하는 함수
    const rd = (insertIndex) => {
        let ans = [];

        if (Array.isArray(sourceNode)) {
            // 기사 여러개 이동
            sourceNode.some((node, idx) => {
                const result = makeRowNode(node.data, insertIndex + idx, tgtComponent);
                if (result.success) {
                    ans.push(result.list);
                    return false;
                } else {
                    callback && callback({ header: result });
                    ans = [];
                    return true;
                }
            });
        } else if (typeof sourceNode === 'object') {
            // 기사 1개 이동
            const result = makeRowNode(sourceNode.data, insertIndex, tgtComponent);
            if (result.success) ans.push(result.list);
            else callback && callback({ header: result });
        }

        return ans;
    };

    // 관련기사 추가하는 함수
    const rrd = (firstIndex, parentData) => {
        let ans = [];

        if (Array.isArray(sourceNode)) {
            // 기사 여러개 이동
            sourceNode.some((node, idx) => {
                const result = makeRelRowNode(node.data, firstIndex + idx, parentData, tgtComponent);
                if (result.success) {
                    ans.push(result.list);
                    return false;
                } else {
                    callback && callback({ header: result });
                    ans = [];
                    return true;
                }
            });
        } else if (typeof sourceNode === 'object') {
            // 기사 1개 이동
            const result = makeRelRowNode(sourceNode.data, firstIndex, parentData, tgtComponent);
            if (result.success) ans.push(result.list);
            else callback && callback({ header: result });
        }

        return ans;
    };

    if (overIndex < 0) {
        // 1) 비어있는 ag-grid에 처음으로 데스킹할 때
        appendNodes = rd(1);
    } else {
        // 2) 데스킹 기사가 있는 ag-grid에 기사를 추가할 때
        const targetRowData = target.api.getDisplayedRowAtIndex(overIndex).data;
        if (!targetRowData.rel) {
            // 2-1) hover된 row가 주기사 => 관련기사 추가인가? => 체크된 row에 targetRow가 있는지 확인한다
            const selectedNodes = target.api.getSelectedNodes();
            selectedNodes.forEach((s) => {
                if (s.data.totalId === targetRowData.totalId) addRelArt = true;
            });

            if (!addRelArt) {
                // 주기사 추가
                appendNodes = rd(targetRowData.contentOrd + 1);
            } else {
                // 관련기사 추가 (주기사의 원래 관련기사의 개수를 찾아서 맨 마지막 index로 셋팅)
                const firstIndex = !targetRowData.relSeqs ? 1 : targetRowData.relSeqs.length + 1;
                appendNodes = rrd(firstIndex, targetRowData);
            }
        } else {
            // 2-2) hover된 row가 관련기사 => 주기사를 찾아서 체크된 row인지 확인한다
            const parentRow = target.api.getRowNode(targetRowData.parentTotalId);

            if (parentRow.isSelected()) {
                // 관련기사 추가 (타겟의 relOrd의 밑으로)
                const firstIndex = targetRowData.relOrd + 1;
                appendNodes = rrd(firstIndex, parentRow.data);
            } else {
                // 주기사 추가 (parentRow의 밑으로)
                appendNodes = rd(parentRow.data.contentOrd + 1);
            }
        }
    }

    if (appendNodes.length < 1) return;

    // 컴포넌트간의 이동여부 : 기사목록에서 편집컴포넌트로 드래그드롭됐을때, 기사목록의 체크박스 제거
    const bMoveComponents = srcComponent && srcComponent.seq >= 0;
    if (bMoveComponents) {
        // 이동
        const option = {
            componentWorkSeq: tgtComponent.seq,
            datasetSeq: tgtComponent.datasetSeq,
            srcComponentWorkSeq: srcComponent.seq,
            srcDatasetSeq: srcComponent.datasetSeq,
            list: appendNodes,
            callback,
        };
        yield put({
            type: act.MOVE_DESKING_WORK_LIST,
            payload: option,
        });
    } else {
        // 추가
        const option = {
            componentWorkSeq: tgtComponent.seq,
            datasetSeq: tgtComponent.datasetSeq,
            list: appendNodes,
            callback,
        };
        yield put({
            type: act.POST_DESKING_WORK_LIST,
            payload: option,
        });
        source.api.deselectAll();
    }
}

/**
 * Work컴포넌트 임시저장
 */
const postSaveComponentWork = createDeskingRequestSaga(act.POST_SAVE_COMPONENT_WORK, api.postSaveComponentWork);

/**
 * Work컴포넌트 전송
 */
const postPublishComponentWork = createDeskingRequestSaga(act.POST_PUBLISH_COMPONENT_WORK, api.postPublishComponentWork);

/**
 * Work컴포넌트 예약
 */
const postReserveComponentWork = createDeskingRequestSaga(act.POST_RESERVE_COMPONENT_WORK, api.postReserveComponentWork);

/**
 * 컴포넌트 워크에 편집기사 리스트 등록 => 성공 결과) 컴포넌트 워크 데이터가 리턴됨
 */
const postDeskingWorkList = createDeskingRequestSaga(act.POST_DESKING_WORK_LIST, api.postDeskingWorkList);

/**
 * 컴포넌트워크 간의 데스킹기사 이동 => 성공 결과 ???
 */
function* moveDeskingWorkList({ payload }) {
    const { componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list, callback } = payload;
    const ACTION = act.MOVE_DESKING_WORK_LIST;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // 데스킹기사 이동 api콜
        response = yield call(api.moveDeskingWorkList, { componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list });
        callbackData = response.data;

        if (response.data.header.success) {
            // 컴포넌트 워크 조회 => 이해가 안됨. 컴포넌트 워크가 2개가 바꼈으니까 리스트를 다시 조회해야하는게 아닌지????
            yield put({
                type: act.GET_COMPONENT_WORK,
                payload: { componentWorkSeq: srcComponentWorkSeq },
            });
        } else {
            yield put({
                type: act.COMPONENT_WORK_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: act.COMPONENT_WORK_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 컴포넌트워크의 편집기사 1개 수정 => 결과로 컴포넌트워크가 리턴됨
 */
function* putDeskingWork({ payload }) {
    const { componentWorkSeq, deskingWork, callback } = payload;
    const ACTION = act.PUT_DESKING_WORK;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.putDeskingWork, { componentWorkSeq, deskingWork });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.COMPONENT_WORK_SUCCESS,
                payload: response.data,
            });
        } else {
            // 실패 시 컴포넌트 워크 다시 조회
            yield put({
                type: act.GET_COMPONENT_WORK,
                payload: { componentWorkSeq },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 에러 시 컴포넌트 워크 다시 조회
        yield put({
            type: act.GET_COMPONENT_WORK,
            payload: { componentWorkSeq },
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * work편집기사 삭제
 */
const deleteDeskingWorkList = createDeskingRequestSaga(act.DELETE_DESKING_WORK_LIST, api.deleteDeskingWorkList);

/** saga */
export default function* saga() {
    // 컴포넌트 워크
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
    yield takeLatest(act.PUT_COMPONENT_WORK, putComponentWork);
    yield takeLatest(act.PUT_SNAPSHOT_COMPONENT_WORK, putSnapshotComponentWork);

    yield takeLatest(act.POST_SAVE_COMPONENT_WORK, postSaveComponentWork);
    yield takeLatest(act.POST_PUBLISH_COMPONENT_WORK, postPublishComponentWork);
    yield takeLatest(act.POST_RESERVE_COMPONENT_WORK, postReserveComponentWork);
    // yield takeLatest(act.POST_COMPONENT_WORK, postComponentWorkSaga);
    // yield takeLatest(act.HAS_OTHER_SAVED, hasOtherSavedSaga);

    // 컴포넌트 워크의 데스킹 (편집기사)
    yield takeLatest(act.PUT_DESKING_WORK, putDeskingWork);
    yield takeLatest(act.POST_DESKING_WORK_LIST, postDeskingWorkList);
    yield takeLatest(act.MOVE_DESKING_WORK_LIST, moveDeskingWorkList);

    // yield takeLatest(act.PUT_DESKING_WORK_PRIORITY, putDeskingWorkPrioritySaga);
    // yield takeLatest(act.POST_DESKING_WORK, postDeskingWorkSaga);
    // yield takeLatest(act.PUT_DESKING_REL_WORKS, putDeskingRelWorksSaga);
    yield takeLatest(act.DELETE_DESKING_WORK_LIST, deleteDeskingWorkList);

    // drag 관련
    yield takeEvery(act.DESKING_DRAG_STOP, deskingDragStop);
}
