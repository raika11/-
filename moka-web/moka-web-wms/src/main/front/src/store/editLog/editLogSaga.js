import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '../commons/saga';
import * as api from './editLogApi';
import * as act from './editLogAction';

/**
 * 목록
 */
const getEditLogList = createRequestSaga(act.GET_EDIT_LOG_LIST, api.getEditLogList);

/**
 * 상세 조회
 */
const getEditLog = createRequestSaga(act.GET_EDIT_LOG, api.getEditLog);

export default function* saga() {
    yield takeLatest(act.GET_EDIT_LOG_LIST, getEditLogList);
    yield takeLatest(act.GET_EDIT_LOG, getEditLog);
}
