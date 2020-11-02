import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '../commons/saga';

import * as act from './historyAction';
import * as api from './historyApi';

/**
 * 목록
 */
const getHistoryList = callApiAfterActions(act.GET_HISTORY_LIST, api.getHistoryList, (store) => store.history);

/**
 * 데이터 조회
 */
const getHistory = createRequestSaga(act.GET_HISTORY, api.getHistory);

export default function* domainSaga() {
    yield takeLatest(act.GET_HISTORY_LIST, getHistoryList);
    yield takeLatest(act.GET_HISTORY, getHistory);
}
