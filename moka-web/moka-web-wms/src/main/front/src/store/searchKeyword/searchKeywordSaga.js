import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './searchKeywordApi';
import * as act from './searchKeywordAction';

/**
 * 키워드 통계 조회
 */
export const getSearchKeywordStat = createRequestSaga(act.GET_SEARCH_KEYWORD_STAT, api.getSearchKeywordStat);

export default function* saga() {
    yield takeLatest(act.GET_SEARCH_KEYWORD_STAT, getSearchKeywordStat);
}
