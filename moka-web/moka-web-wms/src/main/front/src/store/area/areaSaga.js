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
            yield put({
                type: act.CHANGE_AREA,
                payload: {
                    depth,
                    area: response.data.body,
                },
            });
            if (depth === 1) {
                yield put({ type: act.GET_AREA_LIST_DEPTH1 });
            } else if (depth === 2) {
                yield put({ type: act.GET_AREA_LIST_DEPTH2 });
            } else {
                yield put({ type: act.GET_AREA_LIST_DEPTH3 });
            }
        } else {
            yield put({
                type: act.CHANGE_INVALID_LIST,
                payload: response.data.body.list,
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
 */
export function* deleteArea({ payload: { areaSeq, callback } }) {
    // const ACTION = act.DELETE_COMPONENT;
    // let callbackData = {};
    // yield put(startLoading(ACTION));
    // try {
    //     const response = yield call(api.deleteComponent, { componentSeq });
    //     callbackData = response.data;
    //     if (response.data.header.success && response.data.body) {
    //         yield put({
    //             type: act.GET_COMPONENT_SUCCESS,
    //             payload: callbackData,
    //         });
    //         // 목록 다시 검색
    //         yield put({ type: act.GET_COMPONENT_LIST });
    //     }
    // } catch (e) {
    //     callbackData = errorResponse(e);
    // }
    // if (typeof callback === 'function') {
    //     yield call(callback, callbackData, componentSeq);
    // }
    // yield put(finishLoading(ACTION));
}

/**
 * 관련 아이템 체크
 */
// const hasRelationList = createRequestSaga(act.HAS_RELATION_LIST, api.hasRelationList, true);

export default function* saga() {
    yield takeLatest(act.GET_AREA_LIST_DEPTH1, getAreaListDepth1);
    yield takeLatest(act.GET_AREA_LIST_DEPTH2, getAreaListDepth2);
    yield takeLatest(act.GET_AREA_LIST_DEPTH3, getAreaListDepth3);
    yield takeLatest(act.GET_AREA_DEPTH1, getAreaDepth1);
    yield takeLatest(act.GET_AREA_DEPTH2, getAreaDepth2);
    yield takeLatest(act.GET_AREA_DEPTH3, getAreaDepth3);
    yield takeLatest(act.SAVE_AREA, saveArea);
}
