import { takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { getRowIndex } from '@utils/agGridUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './deskingApi';
import * as act from './deskingAction';

import { DEFAULT_LANG } from '@/constants';

/**
 * 편집영역 클릭시, Work 컴포넌트 목록 조회
 */
const getComponentWorkList = createRequestSaga(act.GET_COMPONENT_WORK_LIST, api.getComponentWorkList);

/**
 * rowNode 생성
 */
const makeRowNode = (data, overIndex, component) => {
    if (!data || data.totalId === null) return;

    const existRow = component.deskingWorks.filter((desking) => desking.totalId === data.totalId);
    if (existRow && existRow.length > 0) return;

    // 오버된 편집기사의 아래로 추가. (contentsOrd는 1로 시작, overIndex는 0으로 시작함)
    const contentOrd = overIndex < 0 ? 1 : overIndex + 2;
    let appendData = null;

    if (data.gridType === 'ARTICLE') {
        appendData = {
            gridType: 'DESKING',
            componentWorkSeq: component.seq,
            seq: null,
            deskingSeq: null,
            datasetSeq: component.datasetSeq,
            // editionSeq: component.editionSeq,
            totalId: data.totalId,
            parentTotalId: null,
            contentType: data.contentType,
            artType: data.artType,
            sourceCode: data.sourceCode,
            contentOrd: contentOrd,
            relOrd: null,
            saveYn: 'N',
            lang: DEFAULT_LANG,
            distDt: data.serviceDaytime,
            title: data.artEditTitle == null ? data.artTitle : data.artEditTitle,
            mobTitle: data.artEditMobTitle == null ? data.artTitle : data.artEditTitle,
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
            componentWorkSeq: component.seq,
            componentSeq: component.componentSeq,
            datasetSeq: component.datasetSeq,
            // editionSeq: component.editionSeq,
            contentOrd,
        };
    }

    return appendData;
};

/**
 * 데스킹 ag-grid row drag stop
 */
function* deskingDragStop({ payload }) {
    const { source, target, srcComponent, tgtComponent, callback } = payload;

    let overIndex = -1;
    if (target.overIndex) {
        overIndex = target.overIndex;
    } else if (source.event) {
        overIndex = getRowIndex(source.event);
    }

    let appendNodes = [],
        rowNodeData = null;

    // if (target.nodes) {
    //     // 기사 여러개
    //     target.nodes.forEach((node) => {
    //         rowNodeData = makeRowNode(node.data, overIndex, component);
    //         if (rowNodeData) {
    //             overIndex++;
    //             appendNodes.push(rowNodeData);
    //         }
    //     });
    // } else if (target.node) {
    //     // 기사 1건
    //     rowNodeData = makeRowNode(target.node.data, overIndex, component);
    //     if (rowNodeData) {
    //         appendNodes.push(rowNodeData);
    //     }
    // }
    if (source.nodes) {
        // 복수 기사 이동
        for (let i = 0; i < source.nodes.length; i++) {
            const node = source.nodes[i];
            rowNodeData = makeRowNode(node.data, overIndex, tgtComponent);
            if (rowNodeData) {
                overIndex++;
                appendNodes.push(rowNodeData);
            }
        }
    } else if (source.node) {
        // 단일 기사 이동
        rowNodeData = makeRowNode(source.node.data, overIndex, tgtComponent);
        if (rowNodeData) {
            appendNodes.push(rowNodeData);
        }
        // } else if (nodes) {
        //     for (let i = 0; i < nodes.length; i++) {
        //         const node = nodes[i];
        //         rowNodeData = makeRowNode(node, overIndex, tgtComponent);
        //         if (rowNodeData) {
        //             overIndex++;
        //             // deleteNodes.push(node);
        //             appendNodes.push(rowNodeData);
        //         }
        //     }
    }

    // 컴포넌트간의 이동여부 : 기사목록에서 편집컴포넌트로 드래그드롭됐을때, 기사목록의 체크박스 제거
    const bMoveComponents = srcComponent && srcComponent.seq >= 0;

    if (appendNodes.length > 0) {
        if (bMoveComponents) {
            // 이동
            const option = {
                componentWorkSeq: tgtComponent.seq,
                datasetSeq: tgtComponent.datasetSeq,
                srcComponentWorkSeq: srcComponent.seq,
                srcDatasetSeq: srcComponent.datasetSeq,
                list: appendNodes,
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
                deskingWork: appendNodes,
                callback,
            };
            yield put({
                type: act.POST_DESKING_WORK_LIST,
                payload: option,
            });
            source.api.deselectAll();
        }
    }
}

/**
 * Work컴포넌트 임시저장
 */
function* postPreComponentWork(action) {
    const ACTION = act.POST_PRE_COMPONENT_WORK;
    let response, callbackData;
    const { callback } = action.payload;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.postDeskingWorkList, action.payload);

        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
            yield put({
                type: act.COMPONENT_WORK_SUCCESS,
                payload: response.data,
            });
        } else {
            // yield put({
            //     type: deskingStore.COMPONENT_WORK_FAILURE,
            //     payload: response.data,
            //     error: true
            // });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 실패 액션 실행
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
 * 편집기사추가
 */
function* postDeskingWorkList(action) {
    const ACTION = act.POST_DESKING_WORK_LIST;
    let response, callbackData;
    const { componentWorkSeq, datasetSeq, deskingWork, callback } = action.payload;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.postDeskingWorkList, {
            componentWorkSeq,
            datasetSeq,
            deskingWork,
        });

        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
            yield put({
                type: act.COMPONENT_WORK_SUCCESS,
                payload: response.data,
            });
        } else {
            // yield put({
            //     type: deskingStore.COMPONENT_WORK_FAILURE,
            //     payload: response.data,
            //     error: true
            // });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 실패 액션 실행
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

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);

    // yield takeLatest(act.GET_COMPONENT_WORK, getComponentWorkSaga);
    // yield takeLatest(act.POST_COMPONENT_WORK, postComponentWorkSaga);
    yield takeLatest(act.POST_PRE_COMPONENT_WORK, postPreComponentWork);
    // yield takeLatest(act.PUT_COMPONENT_WORK, putComponentWorkSaga);
    // yield takeLatest(act.HAS_OTHER_SAVED, hasOtherSavedSaga);
    // yield takeLatest(act.PUT_DESKING_WORK_PRIORITY, putDeskingWorkPrioritySaga);
    // yield takeLatest(act.POST_DESKING_WORK, postDeskingWorkSaga);
    yield takeLatest(act.POST_DESKING_WORK_LIST, postDeskingWorkList);
    // yield takeLatest(act.MOVE_DESKING_WORK_LIST, moveDeskingWorkListSaga);
    // yield takeLatest(act.PUT_DESKING_WORK, putDeskingWorkSaga);
    // yield takeLatest(act.PUT_DESKING_REL_WORKS, putDeskingRelWorksSaga);
    // yield takeLatest(act.DELETE_DESKING_WORK_LIST, deleteDeskingWorkListSaga);

    // drag 관련
    yield takeEvery(act.DESKING_DRAG_STOP, deskingDragStop);
}
