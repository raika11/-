import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './internalApiAction';
import * as api from './internalApiApi';

/**
 * api 목록 조회
 */
const getInternalApiList = createRequestSaga(act.GET_INTERNAL_API_LIST, api.getInternalApiList);

/**
 * api 조회
 */
const getInternalApi = createRequestSaga(act.GET_INTERNAL_API, api.getInternalApi);

/**
 * 저장
 */
function* saveInternalApi({ payload: { internalApi, callback } }) {
    const ACTION = act.SAVE_INTERNAL_API;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // 등록/수정 분기
        if (internalApi.seqNo) {
            response = yield call(api.putInternalApi, { internalApi });
        } else {
            response = yield call(api.postInternalApi, { internalApi });
        }

        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
            yield put({
                type: act.SAVE_INTERNAL_API_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            const search = yield select(({ internalApi }) => internalApi.search);
            yield put({ type: act.GET_INTERNAL_API_LIST, payload: { search } });
        } else {
            const { body } = response.data;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: body.list,
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
export function* deleteTemplate({ payload: { seqNo, callback } }) {
    const ACTION = act.DELETE_INTERNAL_API;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteInternalApi, { seqNo });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            // 목록 다시 검색
            const search = yield select(({ internalApi }) => internalApi.search);
            yield put({ type: act.GET_INTERNAL_API_LIST, payload: { search } });
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
    yield takeLatest(act.GET_INTERNAL_API_LIST, getInternalApiList);
    yield takeLatest(act.GET_INTERNAL_API, getInternalApi);
    yield takeLatest(act.SAVE_INTERNAL_API, saveInternalApi);
    yield takeLatest(act.DELETE_INTERNAL_API, deleteTemplate);
}
