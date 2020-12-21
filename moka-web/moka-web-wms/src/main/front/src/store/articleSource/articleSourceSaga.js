import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '../commons/saga';

import * as act from './articleSourceAction';
import * as api from './articleSourceApi';

/**
 * 매체 목록 조회
 */
const getSourceList = createRequestSaga(act.getSourceList, api.getSourceList);

/**
 * 벌크 매체 목록 조회
 */
const getBulkSourceList = createRequestSaga(act.getBulkSourceList, api.getBulkSourceList);

export default function* saga() {
    yield takeLatest(act.GET_SOURCE_LIST, getSourceList);
    yield takeLatest(act.GET_BLUK_SOURCE_LIST, getBulkSourceList);
}
