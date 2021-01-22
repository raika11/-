import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './cdnArticleAction';
import * as api from './cdnArticleApi';

/**
 * cdn 기사 목록 조회
 */
const getCdnArticleList = createRequestSaga(act.GET_CDN_ARTICLE_LIST, api.getCdnArticleList);

/**
 * cdn 기사 단건 조회
 */
const getCdnArticle = createRequestSaga(act.GET_CDN_ARTICLE, api.getCdnArticle);

/**
 * cdn 기사 저장
 */
function* saveCdnArticle({ payload: { cdnArticle, callback } }) {
    const ACTION = act.SAVE_CDN_ARTICLE;
    let callbackData, response;

    yield put(startLoading(ACTION));
    try {
        // totalId는 항상 들어오기 때문에 regDt로 등록/수정 분기
        if (cdnArticle.regDt) {
            response = yield call(api.putCdnArticle, { cdnArticle });
        } else {
            response = yield call(api.postCdnArticle, { cdnArticle });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 조회
            const search = yield select((store) => store.cdnArticle.search);
            yield put({
                type: act.GET_CDN_ARTICLE_LIST,
                payload: { search },
            });
        } else {
            const { body } = response.data;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * cdn 캐시 삭제
 */
const clearCache = createRequestSaga(act.CLEAR_CACHE, api.clearCache, true);

/**
 * 중복 cdn 체크
 */
const checkExists = createRequestSaga(act.CHECK_EXISTS, api.checkExists, true);

export default function* saga() {
    yield takeLatest(act.GET_CDN_ARTICLE_LIST, getCdnArticleList);
    yield takeLatest(act.GET_CDN_ARTICLE, getCdnArticle);
    yield takeLatest(act.CLEAR_CACHE, clearCache);
    yield takeLatest(act.SAVE_CDN_ARTICLE, saveCdnArticle);
    yield takeLatest(act.CHECK_EXISTS, checkExists);
}
