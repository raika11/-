import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '../commons/saga';

import * as act from './articleSourceAction';
import * as api from './articleSourceApi';

/**
 * 데스킹 매체 목록 조회
 */
const getDeskingSourceList = createRequestSaga(act.GET_DESKING_SOURCE_LIST, api.getDeskingSourceList);

/**
 * 타입별 매체 목록 조회
 */
const getTypeSourceList = createRequestSaga(act.GET_TYPE_SOURCE_LIST, api.getTypeSourceList);

export default function* saga() {
    yield takeLatest(act.GET_DESKING_SOURCE_LIST, getDeskingSourceList);
    yield takeLatest(act.GET_TYPE_SOURCE_LIST, getTypeSourceList);
}
