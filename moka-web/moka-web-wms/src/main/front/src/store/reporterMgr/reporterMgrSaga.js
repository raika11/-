import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import qs from 'qs';

import * as reporterMgrAPI from './reporterMgrApi';
import * as reporterMgrAction from './reporterMgrAction';

/**
 * 기자관리 목록 조회
 */
const getReporterMgrList = callApiAfterActions(reporterMgrAction.getReporterMgrList(), reporterMgrAPI.getReporterMgrList, (state) => {
    console.log('aaaaaaaaa::' + state.reporterMgr);
    return state.reporterMgr;
});

/**
 * 기자관리 조회
 */
const getReporterMgr = createRequestSaga(reporterMgrAction.getReporterMgr, reporterMgrAPI.getReporterMgr);

/**
 * 기자관리 중복 체크
 * @param {string} param0.payload.repSeq 기자일련번호
 * @param {func} param0.payload.callback 콜백
 */
function* duplicateReporterMgrCheck({ payload: { repSeq, callback } }) {
    const ACTION = reporterMgrAction.duplicateReporterMgrCheck;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(reporterMgrAPI.duplicateReporterMgrCheck, repSeq);
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveReporterMgr({ payload: { type, actions, callback } }) {
    const ACTION = reporterMgrAction.CHANGE_REPORTER_MGR;
    let callbackData = {};

    yield put(startLoading(ACTION));
    //yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        /*
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }
        */

        const act = actions[0];
        yield put({
            type: act.type,
            payload: act.payload,
        });

        // 도메인 데이터
        const reporterMgr = yield select((store) => store.reporterMgr.reporterMgr);
        const response = type === 'insert' ? yield call(reporterMgrAPI.putReporterMgr, { reporterMgr }) : yield call(reporterMgrAPI.putReporterMgr, { reporterMgr });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: reporterMgrAction.GET_REPORTER_MGR_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: reporterMgrAction.GET_REPORTER_MGR_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getReporterMgr(reporterMgr.repSeq));
        } else {
            yield put({
                type: reporterMgrAction.GET_REPORTER_MGR_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: reporterMgrAction.GET_REPORTER_MGR_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* reporterMgrSaga() {
    yield takeLatest(reporterMgrAction.GET_REPORTER_MGR_LIST, getReporterMgrList);
    yield takeLatest(reporterMgrAction.getReporterMgr, getReporterMgr);
    yield takeLatest(reporterMgrAction.DUPLICATE_REPORTER_MGR_CHECK, duplicateReporterMgrCheck);
    yield takeLatest(reporterMgrAction.CHANGE_REPORTER_MGR, saveReporterMgr);
}
