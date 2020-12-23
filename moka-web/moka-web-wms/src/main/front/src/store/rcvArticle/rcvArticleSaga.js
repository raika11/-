import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';
import * as api from './rcvArticleApi';
import * as act from './rcvArticleAction';

/**
 * 수신기사 목록 조회
 */
export const getRcvArticleList = createRequestSaga(act.GET_RCV_ARTICLE_LIST, api.getRcvArticleList);

export default function* saga() {
    yield takeLatest(act.GET_RCV_ARTICLE_LIST, getRcvArticleList);
}
