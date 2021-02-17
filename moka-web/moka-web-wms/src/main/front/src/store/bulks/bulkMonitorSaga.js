import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '@store/commons/saga';
import * as api from './bulkMonitorApi';
import * as act from './bulkMonitorAction';

/**
 * 벌크 모니터링 전체 건수 조회
 */
const getBulkStatTotal = createRequestSaga(act.GET_BULK_STAT_TOTAL, api.getBulkStatTotal);

/**
 * 벌크 모니터링 전송 목록 조회
 */
const getBulkStatList = callApiAfterActions(act.GET_BULK_STAT_LIST, api.getBulkStatList, (store) => store.bulkMonitor);

/**
 * 벌크 모니터링 전송 상세 정보 조회
 */
const getBulkStatListInfo = createRequestSaga(act.GET_BULK_STAT_LIST_INFO, api.getBulkStatListInfo);

/** saga */
export default function* photoArchiveSaga() {
    yield takeLatest(act.GET_BULK_STAT_TOTAL, getBulkStatTotal);
    yield takeLatest(act.GET_BULK_STAT_LIST, getBulkStatList);
    yield takeLatest(act.GET_BULK_STAT_LIST_INFO, getBulkStatListInfo);
}
