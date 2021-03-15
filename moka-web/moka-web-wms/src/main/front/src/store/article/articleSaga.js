import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';
import * as articleSourceApi from '@store/articleSource/articleSourceApi';
import * as articleSourceAct from '@store/articleSource/articleSourceAction';
import * as act from './articleAction';
import * as api from './articleApi';

/**
 * 등록 기사 목록 조회
 */
const getArticleList = createRequestSaga(act.GET_ARTICLE_LIST, api.getArticleList);

/**
 * 등록 기사 목록 조회(모달)
 */
function* getArticleListModal({ payload }) {
    const { search: payloadSearch, type = 'JOONGANG', getSourceList = false, callback } = payload;
    const ACTION = act.GET_ARTICLE_LIST_MODAL;
    let callbackData,
        search = payloadSearch;

    yield put(startLoading(ACTION));
    try {
        if (getSourceList) {
            // 매체 먼저 조회
            const sApi = type === 'DESKING' ? articleSourceApi.getDeskingSourceList : articleSourceApi.getTypeSourceList;
            const sAct = type === 'DESKING' ? articleSourceAct.GET_DESKING_SOURCE_LIST_SUCCESS : articleSourceAct.GET_TYPE_SOURCE_LIST_SUCCESS;
            const sourceResponse = yield call(sApi, { type });
            if (sourceResponse.data.header.success) {
                yield put({ type: sAct, payload: { ...sourceResponse.data, payload } });
                const sourceList = (sourceResponse.data.body.list || []).map((s) => s.sourceCode).join(',');
                search = { ...search, sourceList };
            } else {
                callbackData = errorResponse({ ...sourceResponse.data });
                if (typeof callback === 'function') {
                    yield call(callback, callbackData);
                }

                yield put(finishLoading(ACTION));
                return;
            }
        }

        const response =
            type === 'DESKING'
                ? yield call(api.getServiceArticleList, { search })
                : type === 'BULK'
                ? yield call(api.getBulkArticleList, { search })
                : yield call(api.getArticleList, { search });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, { ...callbackData, search });
    }

    yield put(finishLoading(ACTION));
}

/**
 * 등록 기사 단건 조회
 */
const getArticle = createRequestSaga(act.GET_ARTICLE, api.getArticle);

/**
 * 기사 편집제목 수정
 */
function* putArticleEditTitle({ payload }) {
    const { totalId, artEditTitle, artEditMobTitle, callback } = payload;
    const ACTION = act.PUT_ARTICLE_EDIT_TITLE;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putArticleEditTitle, { totalId, artEditTitle, artEditMobTitle });
        callbackData = response.data;
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

/**
 * 등록 기사 수정
 */
function* saveArticle({ payload: { article, callback } }) {
    const ACTION = act.SAVE_ARTICLE;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putArticle, { article });
        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
            yield put({
                type: act.SAVE_ARTICLE_SUCCESS,
                payload: response.data,
            });
            // 목록 조회 로직은 여기에 추가하지 않음 (수신/등록 분기해야하므로 개별 처리)
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
 * 등록기사 삭제
 */
function* deleteArticle({ payload: { totalId, callback } }) {
    const ACTION = act.DELETE_ARTICLE;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteArticle, { totalId });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.article.search);
            yield put({ type: act.GET_ARTICLE_LIST, payload: { search } });
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
 * 등록기사 중지
 */
function* stopArticle({ payload: { totalId, callback } }) {
    const ACTION = act.STOP_ARTICLE;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.stopArticle, { totalId });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select((store) => store.article.search);
            yield put({ type: act.GET_ARTICLE_LIST, payload: { search } });
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
 * 등록기사 히스토리 조회
 */
const getArticleHistoryList = createRequestSaga(act.GET_ARTICLE_HISTORY_LIST, api.getArticleHistoryList);

export default function* saga() {
    yield takeLatest(act.GET_ARTICLE_LIST, getArticleList);
    yield takeLatest(act.PUT_ARTICLE_EDIT_TITLE, putArticleEditTitle);
    yield takeLatest(act.GET_ARTICLE_IMAGE_LIST, getArticleImageList);
    yield takeLatest(act.GET_ARTICLE, getArticle);
    yield takeLatest(act.SAVE_ARTICLE, saveArticle);
    yield takeLatest(act.DELETE_ARTICLE, deleteArticle);
    yield takeLatest(act.STOP_ARTICLE, stopArticle);
    yield takeLatest(act.GET_ARTICLE_HISTORY_LIST, getArticleHistoryList);
    yield takeEvery(act.GET_ARTICLE_LIST_MODAL, getArticleListModal);
}
