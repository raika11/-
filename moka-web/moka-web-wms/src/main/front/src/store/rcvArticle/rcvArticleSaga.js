import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';
import * as api from './rcvArticleApi';
import * as act from './rcvArticleAction';

/**
 * 수신기사 목록 조회
 */
const getRcvArticleList = createRequestSaga(act.GET_RCV_ARTICLE_LIST, api.getRcvArticleList);

/**
 * 수신기사 조회
 */
const getRcvArticle = createRequestSaga(act.GET_RCV_ARTICLE, api.getRcvArticle);

/**
 * 수신기사 조회(모달)
 */
const getRcvArticleModal = createRequestSaga(act.GET_RCV_ARTICLE_MODAL, api.getRcvArticle, true);

/**
 * 수신기사 => 등록기사 부가정보 수정하면서 등록
 */
const postRcvArticle = createRequestSaga(act.POST_RCV_ARTICLE, api.postRcvArticle);

/**
 * 수신기사 => 등록기사 등록만
 */
const postRcvArticleWithRid = createRequestSaga(act.POST_RCV_ARTICLE_WITH_RID, api.postRcvArticleWithRid);

export default function* saga() {
    yield takeLatest(act.GET_RCV_ARTICLE_LIST, getRcvArticleList);
    yield takeLatest(act.GET_RCV_ARTICLE, getRcvArticle);
    yield takeLatest(act.GET_RCV_ARTICLE_MODAL, getRcvArticleModal);
    yield takeLatest(act.POST_RCV_ARTICLE, postRcvArticle);
    yield takeLatest(act.POST_RCV_ARTICLE_WITH_RID, postRcvArticleWithRid);
}
