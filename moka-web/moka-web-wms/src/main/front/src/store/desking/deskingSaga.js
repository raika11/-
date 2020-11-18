import { takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { getRowIndex } from '@utils/agGridUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './deskingApi';
import * as act from './deskingAction';

import { DEFAULT_LANG } from '@/constants';

/**
 * 편집영역 클릭시, 컴포넌트 워크 목록 조회
 */
const getComponentWorkList = createRequestSaga(act.GET_COMPONENT_WORK_LIST, api.getComponentWorkList);

/**
 * 컴포넌트 워크 1개 조회
 */
const getComponentWork = createRequestSaga(act.GET_COMPONENT_WORK, api.getComponentWork);

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
            regDt: undefined,
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
 * 컴포넌트워크의 ag-grid row drag stop
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

    if (source.nodes) {
        // 기사 여러개 이동
        for (let i = 0; i < source.nodes.length; i++) {
            const node = source.nodes[i];
            rowNodeData = makeRowNode(node.data, overIndex, tgtComponent);
            if (rowNodeData) {
                overIndex++;
                appendNodes.push(rowNodeData);
            }
        }
    } else if (source.node) {
        // 기사 1개 이동
        rowNodeData = makeRowNode(source.node.data, overIndex, tgtComponent);
        if (rowNodeData) {
            appendNodes.push(rowNodeData);
        }
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
                deskingWorkList: appendNodes,
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
 * 컴포넌트 워크에 편집기사 리스트 등록 => 성공 결과) 컴포넌트 워크 데이터가 리턴됨
 */
function* postDeskingWorkList({ payload }) {
    const { componentWorkSeq, datasetSeq, deskingWorkList, callback } = payload;
    const ACTION = act.POST_DESKING_WORK_LIST;
    let response, callbackData;

    yield put(startLoading(ACTION));

    try {
        response = yield call(api.postDeskingWorkList, {
            componentWorkSeq,
            datasetSeq,
            deskingWorkList,
        });

        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
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

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
    yield takeLatest(act.GET_COMPONENT_WORK, getComponentWork);

    // yield takeLatest(act.POST_COMPONENT_WORK, postComponentWorkSaga);
    yield takeLatest(act.POST_PRE_COMPONENT_WORK, postPreComponentWork);
    // yield takeLatest(act.PUT_COMPONENT_WORK, putComponentWorkSaga);
    // yield takeLatest(act.HAS_OTHER_SAVED, hasOtherSavedSaga);
    // yield takeLatest(act.PUT_DESKING_WORK_PRIORITY, putDeskingWorkPrioritySaga);
    // yield takeLatest(act.POST_DESKING_WORK, postDeskingWorkSaga);
    yield takeLatest(act.POST_DESKING_WORK_LIST, postDeskingWorkList);
    yield takeLatest(act.MOVE_DESKING_WORK_LIST, moveDeskingWorkList);
    // yield takeLatest(act.PUT_DESKING_WORK, putDeskingWorkSaga);
    // yield takeLatest(act.PUT_DESKING_REL_WORKS, putDeskingRelWorksSaga);
    // yield takeLatest(act.DELETE_DESKING_WORK_LIST, deleteDeskingWorkListSaga);

    // drag 관련
    yield takeEvery(act.DESKING_DRAG_STOP, deskingDragStop);
}
