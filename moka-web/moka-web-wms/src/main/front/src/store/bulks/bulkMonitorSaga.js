import { call, put, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './bulkMonitorApi';
import * as act from './bulkMonitorAction';

/**
 * 벌크 모니터링 전체 건수 조회
 */
const getBulkStatTotal = callApiAfterActions(act.GET_BULK_STAT_TOTAL, api.getBulkStatTotal, (store) => store.bulkMonitor);

/** saga */
export default function* photoArchiveSaga() {
    yield takeLatest(act.GET_BULK_STAT_TOTAL, getBulkStatTotal);
}
