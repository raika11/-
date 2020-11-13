import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import qs from 'qs';

import * as reporterAPI from './reporterApi';
import * as reporterAction from './reporterAction';
import * as datasetAction from '@store/dataset/datasetAction';
import * as datasetAPI from '@store/dataset/datasetApi';

/**
 * 기자관리 목록 조회
 */
const getReporterList = callApiAfterActions(reporterAction.GET_REPORTER_LIST, reporterAPI.getReporterList, (state) => {
    return state.reporter;
});

/**
 * 기자관리 조회
 */
const getReporter = createRequestSaga(reporterAction.GET_REPORTER, reporterAPI.getReporter);

/**
 * 데이터셋 리스트 조회(모달에서 사용하는 리스트)
 */
const getReporterListModal = createRequestSaga(reporterAction.GET_REPORTER_LIST_MODAL, reporterAPI.getReporterList, (state) => {
    return state.reporter;
});

/**
 * 수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveReporter({ payload: { type, actions, callback } }) {
    const ACTION = reporterAction.CHANGE_REPORTER;
    let response;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const act = actions[0];
        yield put({
            type: act.type,
            payload: act.payload,
        });

        // 도메인 데이터
        const reporter = yield select((store) => store.reporter.reporter);
        response = yield call(reporterAPI.putReporter, { reporter });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: reporterAction.GET_REPORTER_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: reporterAction.GET_REPORTER_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getreporter(reporter.repSeq));
        } else {
            yield put({
                type: reporterAction.GET_REPORTER_FAILURE,
                //payload: callbackData,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: reporterAction.GET_REPORTER_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* reporterSaga() {
    yield takeLatest(reporterAction.GET_REPORTER_LIST_MODAL, getReporterListModal);
    yield takeLatest(reporterAction.GET_REPORTER_LIST, getReporterList);
    yield takeLatest(reporterAction.GET_REPORTER, getReporter);
    yield takeLatest(reporterAction.SAVE_REPORTER, saveReporter);
}
