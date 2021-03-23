import { takeLatest, put, select, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';
import * as api from './columnistApi';
import * as act from './columnistAction';

/**
 * 칼럼니스트 목록
 */
const getColumnistList = createRequestSaga(act.GET_COLUMNIST_LIST, api.getColumnistList);

/**
 * 칼럼니스트 목록(모달)
 */
const getColumnistListModal = createRequestSaga(act.GET_COLUMNIST_LIST, api.getColumnistList, true);

/**
 * 칼럼니스트
 */
const getColumnist = createRequestSaga(act.GET_COLUMNIST, api.getColumnist);

/**
 * 칼럼니스트 저장
 */
function* saveColumnist({ payload: { columnist, callback } }) {
    const ACTION = act.SAVE_COLUMNIST;
    let callbackData = {},
        response;

    yield put(startLoading(ACTION));
    try {
        response = columnist.seqNo ? yield call(api.putColumnist, { columnist }) : yield call(api.postColumnist, { columnist });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_COLUMNIST_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 조회
            const search = yield select(({ columnist }) => columnist.search);
            yield put({ type: act.GET_COLUMNIST_LIST, payload: { search } });
        } else {
            const { body } = response.data;
            if (body && body.list && Array.isArray(body.list)) {
                yield put({
                    type: act.CHANGE_INVALID_LINK,
                    payload: response.data.body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: act.GET_COLUMNIST_LIST_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* saga() {
    yield takeLatest(act.GET_COLUMNIST_LIST, getColumnistList);
    yield takeLatest(act.GET_COLUMNIST_LIST_MODAL, getColumnistListModal);
    yield takeLatest(act.SAVE_COLUMNIST, saveColumnist);
    yield takeLatest(act.GET_COLUMNIST, getColumnist);
}
