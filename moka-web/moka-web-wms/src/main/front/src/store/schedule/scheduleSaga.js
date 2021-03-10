import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import * as act from './scheduleAction';
import * as api from './scheduleApi';

/**
 * 작업 목록 > 먼저 스케줄 작업 목록, 사용 중인 배포서버 목록 조회
 */
// function* get({ payload: { reporter, callback } }) {
//     const ACTION = reporterAction.SAVE_REPORTER;
//     let callbackData = {};

//     yield put(startLoading(ACTION));

//     try {
//         // 기자 데이터
//         const response = yield call(reporterAPI.putReporter, { reporter });
//         callbackData = response.data;

//         if (response.data.header.success) {
//             yield put({
//                 type: reporterAction.GET_REPORTER_SUCCESS,
//                 payload: response.data,
//             });

//             // 목록 다시 검색
//             yield put({ type: reporterAction.GET_REPORTER_LIST });
//         }
//     } catch (e) {
//         callbackData = errorResponse(e);

//         yield put({
//             type: reporterAction.GET_REPORTER_FAILURE,
//             payload: callbackData,
//         });
//     }

//     if (typeof callback === 'function') {
//         yield call(callback, callbackData);
//     }

//     yield put(finishLoading(ACTION));
// }

/**
 * 배포 서버 목록 조회(검색 조건 코드)
 */
const getDistributeServerCode = createRequestSaga(act.GET_DISTRIBUTE_SERVER_CODE, api.getDistributeServerCode);

/**
 * 작업 목록 조회
 */
const getJobList = callApiAfterActions(act.GET_JOB_LIST, api.getJobList, (state) => state.schedule.work);

/**
 * 작업 상세 조회
 */
const getJob = createRequestSaga(act.GET_JOB, api.getJob);

/**
 * 배포 서버 목록 조회
 */
const getDistributeServerList = callApiAfterActions(act.GET_DISTRIBUTE_SERVER_LIST, api.getDistributeServerList, (state) => state.schedule.deployServer);

export default function* scheduleSaga() {
    yield takeLatest(act.GET_DISTRIBUTE_SERVER_CODE, getDistributeServerCode);
    yield takeLatest(act.GET_JOB_LIST, getJobList);
    yield takeLatest(act.GET_JOB, getJob);
    yield takeLatest(act.GET_DISTRIBUTE_SERVER_LIST, getDistributeServerList);
}
