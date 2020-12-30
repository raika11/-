import { takeLatest, put, call, select } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
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
 * 등록 후 리스트 조회하는 사가
 */
function createRegisterSaga(actionType, api) {
    return function* (action) {
        const payload = action.payload;
        const { callback } = payload;
        let callbackData;

        yield put(startLoading(actionType));

        try {
            const response = yield call(api, action.payload);
            callbackData = { ...response.data, payload };

            if (response.data.header.success) {
                const search = yield select((store) => store.rcvArticle.search);
                // 리스트 다시 조회
                yield put({
                    type: act.GET_RCV_ARTICLE_LIST,
                    payload: { search },
                });
            }
        } catch (e) {
            callbackData = errorResponse(e);
        }

        if (typeof callback === 'function') {
            yield call(callback, callbackData);
        }

        yield put(finishLoading(actionType));
    };
}

/**
 * 수신기사 => 등록기사 부가정보 수정하면서 등록
 */
const postRcvArticle = createRegisterSaga(act.POST_RCV_ARTICLE, api.postRcvArticle);

/**
 * 수신기사 => 등록기사 등록만
 */
const postRcvArticleWithRid = createRegisterSaga(act.POST_RCV_ARTICLE_WITH_RID, api.postRcvArticleWithRid);

export default function* saga() {
    yield takeLatest(act.GET_RCV_ARTICLE_LIST, getRcvArticleList);
    yield takeLatest(act.GET_RCV_ARTICLE, getRcvArticle);
    yield takeLatest(act.GET_RCV_ARTICLE_MODAL, getRcvArticleModal);
    yield takeLatest(act.POST_RCV_ARTICLE, postRcvArticle);
    yield takeLatest(act.POST_RCV_ARTICLE_WITH_RID, postRcvArticleWithRid);
}
