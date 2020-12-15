import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './specialApi';
import * as act from './specialAction';

/**
 * 디지털스페셜 목록 조회
 */
const getSpecialList = callApiAfterActions(act.GET_SPECIAL_LIST, api.getSpecialList, (store) => store.special);

export default function* saga() {
    yield takeLatest(act.GET_SPECIAL_LIST, getSpecialList);
}
