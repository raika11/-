import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading';

import * as act from './areaAction';
import * as api from './areaApi';

/**
 * 편집영역 목록 조회(모달용)
 */
const getAreaListModal = createRequestSaga(act.GET_AREA_LIST_MODAL, api.getAreaList, true);
const getAreaModal = createRequestSaga(act.GET_AREA_MODAL, api.getArea, true);

/**
 * 저장/수정
 * @param {object} param0.payload.area area 데이터
 * @param {func} param0.payload.callback 콜백
 */
export function* saveArea({ payload: { area, callback } }) {
    let ACTION = act.SAVE_AREA;
    let response,
        callbackData = {};

    yield put(startLoading(ACTION));
    try {
        // 등록/수정 분기
        if (area.areaSeq) {
            response = yield call(api.putArea, { area });
        } else {
            response = yield call(api.postArea, { area });
        }

        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
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
    const ACTION = act.DELETE_AREA;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteArea, { areaSeq });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 편집영역 트리 조회(페이지편집용)
 */
const getAreaTree = createRequestSaga(act.GET_AREA_TREE, api.getAreaTree);

export default function* saga() {
    yield takeEvery(act.GET_AREA_LIST_MODAL, getAreaListModal);
    yield takeEvery(act.GET_AREA_MODAL, getAreaModal);
    yield takeLatest(act.SAVE_AREA, saveArea);
    yield takeLatest(act.DELETE_AREA, deleteArea);
    yield takeLatest(act.GET_AREA_TREE, getAreaTree);
}
