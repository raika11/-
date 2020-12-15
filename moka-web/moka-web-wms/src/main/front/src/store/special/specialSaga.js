import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './specialApi';
import * as act from './specialAction';

/**
 * 디지털스페셜 목록 조회
 */
const getSpecialList = callApiAfterActions(act.GET_SPECIAL_LIST, api.getSpecialList, (store) => store.special);

/**
 * 디지털스페셜 조회
 */
const getSpecial = createRequestSaga(act.GET_SPECIAL, api.getSpecial);

/**
 * 디지털 스페셜의 부서조회
 */
const getSpecialDeptList = createRequestSaga(act.GET_SPECIAL_DEPT_LIST, api.getSpecialDeptList);

export default function* saga() {
    yield takeLatest(act.GET_SPECIAL_LIST, getSpecialList);
    yield takeLatest(act.GET_SPECIAL, getSpecial);
    yield takeLatest(act.GET_SPECIAL_DEPT_LIST, getSpecialDeptList);
}
