import { call, put, takeLatest, select } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading';

import * as act from './areaAction';
import * as api from './areaApi';

/**
 * 편집영역 목록 조회
 */
const getAreaListDepth1 = callApiAfterActions(act.GET_AREA_LIST_DEPTH1, api.getAreaList, (store) => store.area.depth1);
const getAreaListDepth2 = callApiAfterActions(act.GET_AREA_LIST_DEPTH2, api.getAreaList, (store) => store.area.depth2);
const getAreaListDepth3 = callApiAfterActions(act.GET_AREA_LIST_DEPTH3, api.getAreaList, (store) => store.area.depth3);

/**
 * 편집영역 목록 조회(모달용)
 */
const getAreaListModal = createRequestSaga(act.GET_AREA_LIST_MODAL, api.getAreaList, true);

/**
 * 편집영역 조회
 */
const getAreaDepth1 = createRequestSaga(act.GET_AREA_DEPTH1, api.getArea);
const getAreaDepth2 = createRequestSaga(act.GET_AREA_DEPTH2, api.getArea);
const getAreaDepth3 = createRequestSaga(act.GET_AREA_DEPTH3, api.getArea);

/**
 * 저장/수정
 * @param {array} param0.payload.actions 저장 전 액션리스트
 * @param {func} param0.payload.callback 콜백
 */
export function* saveArea({ payload: { actions, callback, depth } }) {
    let ACTION = act.SAVE_AREA;
    let response,
        callbackData = {};

    yield put(startLoading(ACTION));
    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 편집영역 데이터
        const area = yield select((store) => store.area[`depth${depth}`].area);

        // 등록/수정 분기
        if (area.areaSeq) {
            response = yield call(api.putArea, { area });
        } else {
            response = yield call(api.postArea, { area });
        }

        callbackData = response.data;

        if (response.data.header.success) {
            if (depth === 1) {
                // 수정 시 데이터 다시 로드...
                if (area.areaSeq) {
                    yield put({
                        type: act.GET_AREA_DEPTH1,
                        payload: { areaSeq: area.areaSeq },
                    });
                }
                yield put({ type: act.GET_AREA_LIST_DEPTH1 });
            } else if (depth === 2) {
                if (area.areaSeq) {
                    yield put({
                        type: act.GET_AREA_DEPTH2,
                        payload: { areaSeq: area.areaSeq },
                    });
                }
                yield put({ type: act.GET_AREA_LIST_DEPTH2 });
            } else if (depth === 3) {
                if (area.areaSeq) {
                    yield put({
                        type: act.GET_AREA_DEPTH3,
                        payload: { areaSeq: area.areaSeq },
                    });
                }
                yield put({ type: act.GET_AREA_LIST_DEPTH3 });
            }
        } else {
            yield put({
                type: act.GET_AREA_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_AREA_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string|number} param0.payload.areaSeq 편집영역ID (필수)
 * @param {func} param0.payload.callback 콜백
 * @param {number} param0.payload.depth 삭제하는 areaSeq의 depth
 */
export function* deleteArea({ payload: { areaSeq, callback, depth } }) {
    const ACTION = act.DELETE_AREA;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteArea, { areaSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: act.DELETE_AREA_SUCCESS,
            });

            // 목록 다시 검색
            if (depth === 1) {
                yield put({ type: act.GET_AREA_LIST_DEPTH1 });
                yield put({ type: act.CLEAR_LIST, payload: 2 });
                yield put({ type: act.CLEAR_LIST, payload: 3 });
            } else if (depth === 2) {
                yield put({ type: act.GET_AREA_LIST_DEPTH2 });
                yield put({ type: act.CLEAR_LIST, payload: 3 });
            } else if (depth === 3) {
                yield put({ type: act.GET_AREA_LIST_DEPTH3 });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 관련 아이템 체크
 */
// const hasRelationList = createRequestSaga(act.HAS_RELATION_LIST, api.hasRelationList, true);

/**
 * 편집영역 트리 조회(페이지편집용)
 */
const getAreaTree = createRequestSaga(act.GET_AREA_TREE, api.getAreaTree);

export default function* saga() {
    yield takeLatest(act.GET_AREA_LIST_DEPTH1, getAreaListDepth1);
    yield takeLatest(act.GET_AREA_LIST_DEPTH2, getAreaListDepth2);
    yield takeLatest(act.GET_AREA_LIST_DEPTH3, getAreaListDepth3);
    yield takeLatest(act.GET_AREA_DEPTH1, getAreaDepth1);
    yield takeLatest(act.GET_AREA_DEPTH2, getAreaDepth2);
    yield takeLatest(act.GET_AREA_DEPTH3, getAreaDepth3);
    yield takeLatest(act.SAVE_AREA, saveArea);
    yield takeLatest(act.DELETE_AREA, deleteArea);
    yield takeLatest(act.GET_AREA_LIST_MODAL, getAreaListModal);
    yield takeLatest(act.GET_AREA_TREE, getAreaTree);
}
