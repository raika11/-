import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './articlePageApi';
import * as act from './articlePageAction';

/**
 * 기사페이지 목록 조회
 */
const getArticlePageList = callApiAfterActions(act.GET_ARTICLE_PAGE_LIST, api.getArticlePageList, (store) => store.articlePage);

/**
 * 페이지 lookup 목록 조회
 */
const getArticlePageLookupList = callApiAfterActions(act.GET_ARTICLE_PAGE_LOOKUP_LIST, api.getArticlePageList, (store) => store.articlePage.lookup);

/**
 * 페이지 조회
 */
const getArticlePage = createRequestSaga(act.GET_ARTICLE_PAGE, api.getArticlePage);

/**
 * 페이지 조회
 */
const getArticlePageLookup = createRequestSaga(act.GET_ARTICLE_PAGE_LOOKUP, api.getArticlePage);

/**
 * 기사 타입별 마지막 기사 조회
 * @param {string|number} param0.payload.artType 페이지ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
export function* getPreviewTotalId({ payload: { artType, callback } }) {
    const ACTION = act.GET_PREVIEW_TOTAL_ID;
    const SUCCESS = act.GET_PREVIEW_TOTAL_ID_SUCCESS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.getPreviewTotalId, { artType });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });
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
 * 동일기사페이지 유형 존재여부
 * @param {string} param0.payload.payload 검색조건
 * @param {func} param0.payload.callback 콜백
 */
function* existsArtType({ payload: { payload, callback } }) {
    console.log(payload);
    const ACTION = act.EXISTS_ARTICLE_TYPE;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.existsArtType, payload);
        console.log(response);
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 저장
 */
function* saveArticlePage({ payload: { actions, callback } }) {
    const ACTION = act.SAVE_ARTICLE_PAGE;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 페이지 데이터와 페이지 바디
        const artPageData = yield select((store) => store.articlePage.articlePage);
        const artPageBody = yield select((store) => store.articlePage.artPageBody);
        // 등록/수정 분기
        if (artPageData.artPageSeq) {
            response = yield call(api.putArticlePage, { articlePage: { ...artPageData, artPageBody } });
        } else {
            response = yield call(api.postArticlePage, { articlePage: { ...artPageData, artPageBody } });
        }

        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션 실행
            yield put({
                type: act.GET_ARTICLE_PAGE_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_ARTICLE_PAGE_LIST });
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

        // 실패 액션 실행
        yield put({
            type: act.GET_ARTICLE_PAGE_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string|number} param0.payload.pageSeq 페이지ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
export function* deleteArticlePage({ payload: { artPageSeq, callback } }) {
    const ACTION = act.DELETE_ARTICLE_PAGE;
    const SUCCESS = act.DELETE_ARTICLE_PAGE_SUCCESS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteArticlePage, { artPageSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_ARTICLE_PAGE_LIST });
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
 * 관련 아이템 체크
 * @param {string|number} param0.payload.pageseq 페이지ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
function* hasRelationList({ payload: { pageSeq, callback } }) {
    const ACTION = act.HAS_RELATION_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.hasRelationList, { pageSeq });
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
 * 히스토리 목록 조회
 */
const getHistoryList = callApiAfterActions(act.GET_HISTORY_LIST, api.getHistoryList, (store) => store.pageHistory);

/**
 * 히스토리 조회
 */
const getHistory = createRequestSaga(act.GET_HISTORY, api.getHistory);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_ARTICLE_PAGE_LIST, getArticlePageList);
    yield takeLatest(act.GET_ARTICLE_PAGE, getArticlePage);
    yield takeLatest(act.GET_PREVIEW_TOTAL_ID, getPreviewTotalId);
    yield takeLatest(act.EXISTS_ARTICLE_TYPE, existsArtType);
    yield takeLatest(act.SAVE_ARTICLE_PAGE, saveArticlePage);
    yield takeLatest(act.DELETE_ARTICLE_PAGE, deleteArticlePage);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_HISTORY_LIST, getHistoryList);
    yield takeLatest(act.GET_HISTORY, getHistory);
    yield takeLatest(act.GET_ARTICLE_PAGE_LOOKUP_LIST, getArticlePageLookupList);
    yield takeLatest(act.GET_ARTICLE_PAGE_LOOKUP, getArticlePageLookup);
}
