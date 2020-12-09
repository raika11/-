import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';

import * as api from './brightApi';
import * as act from './brightAction';

/**
 * Ovp 리스트 조회
 */
const getOvpList = createRequestSaga(act.GET_OVP_LIST, api.getVideoList);

/**
 * live 리스트 조회
 */
const getLiveList = createRequestSaga(act.GET_LIVE_LIST, api.getLiveList);

export default function* saga() {
    yield takeLatest(act.GET_OVP_LIST, getOvpList);
    yield takeLatest(act.GET_LIVE_LIST, getLiveList);
}
