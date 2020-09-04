import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import * as articleAPI from '~/stores/api/articleAPI';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import * as articleStore from './articleStore';
import * as relationArticleStore from './relationArticleStore';

let message = {};

/**
 * 목록
 */
const getArticlesSaga = callApiAfterActions(
    articleStore.GET_ARTICLES,
    articleAPI.getArticles,
    (state) => state.articleStore
);

/**
 * 기사조회
 */
function* getArticleSaga({ payload }) {
    yield put(startLoading(articleStore.GET_ARTICLE));

    try {
        const { contentsId, success } = payload;

        const response = yield call(articleAPI.getArticle, contentsId);
        if (response.data.header.success) {
            if (typeof success === 'function') yield call(success, response.data.body);
            yield put({
                type: articleStore.GET_ARTICLES_SUCCESS,
                payload: response.data.body
            });
        }
    } catch (e) {
        // 에러
    }
    yield put(finishLoading(articleStore.GET_ARTICLE));
}

/**
 * 관련기사 목록
 */
const getRelArticlesSaga = callApiAfterActions(
    relationArticleStore.GET_ARTICLES,
    articleAPI.getArticles,
    (state) => state.relationArticleStore
);

export default function* articleSaga() {
    yield takeLatest(articleStore.GET_ARTICLES, getArticlesSaga);
    yield takeLatest(relationArticleStore.GET_ARTICLES, getRelArticlesSaga);
    yield takeLatest(articleStore.GET_ARTICLE, getArticleSaga);
}
