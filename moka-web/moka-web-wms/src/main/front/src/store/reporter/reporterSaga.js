import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as reporterAPI from './reporterApi';
import * as reporterAction from './reporterAction';

/**
 * 기자관리 목록 조회
 */
const getReporterList = callApiAfterActions(reporterAction.GET_REPORTER_LIST, reporterAPI.getReporterList, (store) => store.reporter);

/**
 * 기자관리 조회
 */
const getReporter = createRequestSaga(reporterAction.GET_REPORTER, reporterAPI.getReporter);

/**
 * 기자 리스트 조회(모달에서 사용하는 리스트)
 */
const getReporterListModal = createRequestSaga(reporterAction.GET_REPORTER_LIST_MODAL, reporterAPI.getReporterList, true);

/**
 * 전체 기자 목록 조회 (페이징 X)
 */
const getReporterAllList = createRequestSaga(reporterAction.GET_REPORTER_ALL_LIST, reporterAPI.getAllReporterList);

/**
 * 저장
 */
function* saveReporter({ payload: { reporter, callback } }) {
    const ACTION = reporterAction.SAVE_REPORTER;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // // actions 먼저 처리
        // if (actions && actions.length > 0) {
        //     for (let i = 0; i < actions.length; i++) {
        //         const act = actions[i];
        //         yield put({
        //             type: act.type,
        //             payload: act.payload,
        //         });
        //     }
        // }

        // 기자 데이터
        const reporter = yield select((store) => store.reporter.reporter);
        const response = yield call(reporterAPI.putReporter, { reporter });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: reporterAction.GET_REPORTER_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: reporterAction.GET_REPORTER_LIST });
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
    yield takeLatest(reporterAction.GET_REPORTER_ALL_LIST, getReporterAllList);
}
