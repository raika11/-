import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './articleAction';
import * as api from './articleApi';

/**
 * 기사 목록 조회
 */
const getArticleList = createRequestSaga(act.getArticleList, api.getArticleList);

/**
 * 매체 목록 조회
 */
const getSourceList = createRequestSaga(act.getSourceList, api.getSourceList);

/**
 * 기사 편집제목 수정
 */
function* putArticleEditTitle({ payload }) {
    const { totalId, title, mobTitle, callback } = payload;
    const ACTION = act.PUT_ARTICLE_EDIT_TITLE;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putArticleEditTitle, { totalId, title, mobTitle });
        callbackData = response.data;

        if (response.data.header.success) {
            // 기사리스트 다시 조회
            yield put({ type: act.GET_ARTICLE_LIST });
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
 * 기사 내 이미지 목록 조회
 */
const getArticleImageList = createRequestSaga(act.getArticleImageList, api.getArticleImageList);

export default function* saga() {
    yield takeLatest(act.GET_ARTICLE_LIST, getArticleList);
    yield takeLatest(act.GET_SOURCE_LIST, getSourceList);
    yield takeLatest(act.PUT_ARTICLE_EDIT_TITLE, putArticleEditTitle);
    yield takeLatest(act.GET_ARTICLE_IMAGE_LIST, getArticleImageList);
}
