import { takeLatest, put, call, select } from 'redux-saga/effects';
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
 * 작업 등록, 수정
 */
function* saveJob({ payload: { job, jobSeq, callback } }) {
    const ACTION = act.SAVE_JOB;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // 등록 수정 분기
        const response = yield call(jobSeq ? api.putJob : api.postJob, { job });
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.schedule.work.search);
            yield put({ type: act.GET_JOB_LIST, payload: { search } });
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
 * 작업 삭제
 */
function* deleteJob({ payload: { jobSeq, callback } }) {
    const ACTION = act.DELETE_JOB;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteJob, { jobSeq });
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.schedule.work.search);
            yield put({ type: act.GET_JOB_LIST, payload: { search } });
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
 * 삭제 작업 목록 조회
 */
const getDeleteJobList = callApiAfterActions(act.GET_DELETE_JOB_LIST, api.getDeleteJobList, (state) => state.schedule.deleteWork);

/**
 * 삭제 작업 상세 조회
 */
const getDeleteJob = createRequestSaga(act.GET_DELETE_JOB, api.getDeleteJob);

/**
 * 삭제 작업 상세 조회
 */
const putRecoverJob = createRequestSaga(act.PUT_RECOVER_JOB, api.putRecoverJob);

/**
 * 배포 서버 목록 조회
 */
const getDistributeServerList = callApiAfterActions(act.GET_DISTRIBUTE_SERVER_LIST, api.getDistributeServerList, (state) => state.schedule.deployServer);

/**
 * 배포 서버 상세 조회
 */
const getDistributeServer = createRequestSaga(act.GET_DISTRIBUTE_SERVER, api.getDistributeServer);

/**
 * 배포 서버 등록, 수정
 */
function* saveDistributeServer({ payload: { server, serverSeq, callback } }) {
    const ACTION = act.SAVE_DISTRIBUTE_SERVER;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // 등록 수정 분기
        const response = yield call(serverSeq ? api.putDistributeServer : api.postDistributeServer, { server });
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.schedule.deployServer.search);
            yield put({ type: act.GET_DISTRIBUTE_SERVER_LIST, payload: { search } });
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
 * 배포 서버 삭제
 */
function* deleteServer({ payload: { serverSeq, callback } }) {
    const ACTION = act.DELETE_SERVER;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteDistributeServer, { serverSeq });
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.schedule.deployServer.search);
            yield put({ type: act.GET_DISTRIBUTE_SERVER_LIST, payload: { search } });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* scheduleSaga() {
    yield takeLatest(act.GET_DISTRIBUTE_SERVER_CODE, getDistributeServerCode);
    yield takeLatest(act.GET_JOB_LIST, getJobList);
    yield takeLatest(act.GET_JOB, getJob);
    yield takeLatest(act.SAVE_JOB, saveJob);
    yield takeLatest(act.DELETE_JOB, deleteJob);
    yield takeLatest(act.GET_DELETE_JOB_LIST, getDeleteJobList);
    yield takeLatest(act.GET_DELETE_JOB, getDeleteJob);
    yield takeLatest(act.PUT_RECOVER_JOB, putRecoverJob);
    yield takeLatest(act.GET_DISTRIBUTE_SERVER_LIST, getDistributeServerList);
    yield takeLatest(act.GET_DISTRIBUTE_SERVER, getDistributeServer);
    yield takeLatest(act.SAVE_DISTRIBUTE_SERVER, saveDistributeServer);
    yield takeLatest(act.DELETE_SERVER, deleteServer);
}
