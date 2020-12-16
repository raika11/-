import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './specialApi';
import * as act from './specialAction';

/**
 * 디지털스페셜 목록 조회
 */
const getSpecialList = callApiAfterActions(act.GET_SPECIAL_LIST, api.getSpecialList, (store) => store.special);

/**
 * 디지털스페셜 조회
 */
const getSpecial = createRequestSaga(act.GET_SPECIAL, api.getSpecial);

/**
 * 디지털 스페셜의 부서조회
 */
const getSpecialDeptList = createRequestSaga(act.GET_SPECIAL_DEPT_LIST, api.getSpecialDeptList);

/**
 * 디지털 스페셜 저장
 */
function* saveSpecial({ payload }) {
    const { special, callback } = payload;
    const ACTION = act.SAVE_SPECIAL;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // 등록/수정 분기
        if (special.seqNo) {
            response = yield call(api.putSpecial, { special });
        } else {
            response = yield call(api.postSpecial, { special });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_SPECIAL_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({
                type: act.GET_SPECIAL_LIST,
            });
        } else {
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: response.data.body.list,
                });
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
 * 삭제
 */
function* deleteSpecial({ payload }) {
    const { seqNo, callback } = payload;
    const ACTION = act.DELETE_SPECIAL;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.deleteSpecial, { seqNo });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: act.DELETE_SPECIAL_SUCCESS,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_SPECIAL_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

export default function* saga() {
    yield takeLatest(act.GET_SPECIAL_LIST, getSpecialList);
    yield takeLatest(act.GET_SPECIAL, getSpecial);
    yield takeLatest(act.GET_SPECIAL_DEPT_LIST, getSpecialDeptList);
    yield takeLatest(act.SAVE_SPECIAL, saveSpecial);
    yield takeLatest(act.DELETE_SPECIAL, deleteSpecial);
}
