import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    callApiAfterActions,
    // createRequestSaga,
    errorResponse,
} from '@store/commons/saga';
// import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './bulkMonitorApi';
import * as act from './bulkMonitorAction';

/**
 * 벌크 모니터링 전체 건수 조회
 */
const getBulkStatTotal = callApiAfterActions(act.GET_BULK_STAT_TOTAL, api.getBulkStatTotal, (store) => store.bulkMonitor);

/**
 * 벌크 모니터링 전송 목록 조회
 */
const getBulkStatList = callApiAfterActions(act.GET_BULK_STAT_LIST, api.getBulkStatList, (store) => store.bulkMonitor);

/**
 * 벌크 모니터링 조회
 */
export const getBulkMonitor = (actionType) => {
    return function* ({ payload: actions }) {
        try {
            // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
            if (actions && actions.length > 0) {
                for (let i = 0; i < actions.length; i++) {
                    const act = actions[i];
                    if (act) {
                        yield put({
                            type: act.type,
                            payload: act.payload,
                        });
                    }
                }
            }

            const search = yield select((store) => store.bulkMonitor.search);
            const statTotal = yield call(api.getBulkStatTotal, { search });
            const statList = yield call(api.getBulkStatList, { search });

            if (statTotal.data.header.success && statList.data.header.success) {
                yield put({
                    type: act.GET_BULK_STAT_TOTAL_SUCCESS,
                    payload: statTotal.data,
                });
                yield put({
                    type: act.GET_BULK_STAT_LIST_SUCCESS,
                    payload: statList.data,
                });
            } else {
                yield put({
                    type: act.GET_BULK_STAT_TOTAL_FAILURE,
                    payload: statTotal.data,
                });
                yield put({
                    type: act.GET_BULK_STAT_LIST_FAILURE,
                    payload: statList.data,
                });

                // origin, type 조회 실패
                // 실패 액션
            }
        } catch (e) {
            yield put({
                type: act.GET_BULK_STAT_TOTAL_FAILURE,
                payload: errorResponse(e),
            });

            yield put({
                type: act.GET_BULK_STAT_LIST_FAILURE,
                payload: errorResponse(e),
            });
        }
    };
};

/** saga */
export default function* photoArchiveSaga() {
    yield takeLatest(act.GET_BULK_STAT_TOTAL, getBulkStatTotal);
    yield takeLatest(act.GET_BULK_STAT_LIST, getBulkStatList);
    yield takeLatest(act.GET_BULK_MONITOR, getBulkMonitor);
}
