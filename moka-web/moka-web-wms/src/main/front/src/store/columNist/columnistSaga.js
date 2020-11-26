import { takeLatest, put, select, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as Api from './columnistApi';
import * as act from './columnistAction';

// 칼럼 니스트 검색.
const getColumnistListSaga = callApiAfterActions(act.GET_COLUMNIST_LIST, Api.getColumnistList, (state) => state.columNist.columnlist_list.search);

// 기자 검색.
const getRepoterSearchList = callApiAfterActions(act.GET_REPOTER_LIST, Api.getRepoterList, (state) => state.columNist.repoter_list.search);

const getColumnist = createRequestSaga(act.GET_COLUMNIST, Api.getColumnist);

function* saveColumnist({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_COLUMNIST;
    yield put(startLoading(ACTION));
    let callbackData = {};
    let response;

    try {
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        const columnist = yield select((store) => store.columNist.columnist);
        if (type === 'insert') {
            response = yield call(Api.postColumnist, { columnist });
        } else if (type === 'update') {
            response = yield call(Api.putColumnist, { columnist });
        }
        callbackData = response.data;
        if (response.data.header.success) {
            yield put({
                type: act.GET_COLUMNIST_SUCCESS,
                payload: response.data,
            });
            yield put({ type: act.GET_COLUMNIST_LIST });
        } else {
            // 실패 처리.
            const { body } = response.data.body;
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

/**
 * 에디트 모드 처리.
 */
function* chengEditModeToggle({ payload: { editmode, callback } }) {
    yield put({ type: act.CHANGE_COLUMNIST_LIST_EDIT_MODE_SUCCESS, payload: editmode });
    if (typeof callback === 'function') {
        yield call(callback);
    }
}

export default function* columNistSaga() {
    yield takeLatest(act.GET_COLUMNIST_LIST, getColumnistListSaga);
    yield takeLatest(act.GET_REPOTER_LIST, getRepoterSearchList);
    yield takeLatest(act.SAVE_COLUMNIST, saveColumnist);
    yield takeLatest(act.GET_COLUMNIST, getColumnist);
    yield takeLatest(act.CHANGE_COLUMNIST_LIST_EDIT_MODE, chengEditModeToggle);
}
