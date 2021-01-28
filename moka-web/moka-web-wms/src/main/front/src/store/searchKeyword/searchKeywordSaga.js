import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';
import * as api from './searchKeywordApi';
import * as act from './searchKeywordAction';

/**
 * 키워드 통계 조회
 */
export const getSearchKeywordStat = createRequestSaga(act.GET_SEARCH_KEYWORD_STAT, api.getSearchKeywordStat);

/**
 * 키워드 전체 건수
 */
export const getSearchKeywordStatTotal = createRequestSaga(act.GET_SEARCH_KEYWORD_STAT_TOTAL, api.getSearchKeywordStatTotal);

/**
 * 키워드 통계 상세
 */
export const getSearchKeywordStatDetail = createRequestSaga(act.GET_SEARCH_KEYWORD_STAT_DETAIL, api.getSearchKeywordStatDetail);

export default function* saga() {
    yield takeLatest(act.GET_SEARCH_KEYWORD_STAT, getSearchKeywordStat);
    yield takeLatest(act.GET_SEARCH_KEYWORD_STAT_TOTAL, getSearchKeywordStatTotal);
    yield takeLatest(act.GET_SEARCH_KEYWORD_STAT_DETAIL, getSearchKeywordStatDetail);
}
