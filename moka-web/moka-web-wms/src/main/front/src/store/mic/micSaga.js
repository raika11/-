import { takeLatest, put, call, select } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './micApi';
import * as act from './micAction';

/**
 * 아젠다 목록 조회
 */
const getMicAgendaList = createRequestSaga(act.GET_MIC_AGENDA_LIST, api.getMicAgendaList);

/**
 * 아젠다 목록 조회(모달)
 */
const getMicAgendaListModal = createRequestSaga(act.GET_MIC_AGENDA_LIST_MODAL, api.getMicAgendaList, true);

/**
 * 아젠다 상세 조회
 */
const getMicAgenda = createRequestSaga(act.GET_MIC_AGENDA, api.getMicAgenda);

/**
 * 아젠다 등록/수정
 */
function* saveMicAgenda({ payload }) {
    const { agenda, callback } = payload;
    const ACTION = act.SAVE_MIC_AGENDA;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // 등록/수정 분기
        response = yield call(agenda.agndSeq ? api.putMicAgenda : api.postMicAgenda, { agenda });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 조회
            const search = yield select(({ mic }) => mic.category.search);
            yield put({
                type: act.GET_MIC_CATEGORY_LIST,
                payload: { search },
            });
        } else {
            yield put({
                type: act.CHANGE_INVALID_LIST,
                payload: callbackData.body?.list,
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
 * 아젠다 순서 변경
 */
const putMicAgendaSort = createRequestSaga(act.PUT_MIC_AGENDA_SORT, api.putMicAgendaSort, true);

/**
 * 카테고리 목록 조회
 */
const getMicCategoryList = createRequestSaga(act.GET_MIC_CATEGORY_LIST, api.getMicCategoryList);

/**
 * 카테고리 등록/수정
 */
function* saveMicCategory({ payload }) {
    const { category, categoryList, callback } = payload;
    const ACTION = act.SAVE_MIC_CATEGORY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        if (category) {
            // 등록
            response = yield call(api.postMicCategory, { category });
        } else {
            // 수정
            response = yield call(api.putMicCategory, { categoryList });
        }
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 조회
            const search = yield select(({ mic }) => mic.category.search);
            yield put({
                type: act.GET_MIC_CATEGORY_LIST,
                payload: { search },
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
 * 아젠다, 전체 포스트 수
 */
const getMicReport = createRequestSaga(act.GET_MIC_REPORT, api.getMicReport);

/**
 * 배너 목록 (모달)
 */
const getMicBannerListModal = createRequestSaga(act.GET_MIC_BANNER_LIST_MODAL, api.getMicBannerList, true);

/**
 * 배너 등록/수정
 */
function* saveBanner({ payload }) {
    const { banner, callback } = payload;
    const ACTION = act.SAVE_MIC_BANNER;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(banner.bnnrSeq ? api.putMicBanner : api.postMicBanner, { banner });
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
 * 배너 사용여부 변경
 */
const putMicBannerToggle = createRequestSaga(act.PUT_MIC_BANNER_TOGGLE, api.putMicBannerToggle, true);

/**
 * 피드 목록 조회
 */
const getMicFeedList = createRequestSaga(act.GET_MIC_FEED_LIST, api.getMicAnswerList);

/**
 * 피드 상세 조회
 */
const getMicFeed = createRequestSaga(act.GET_MIC_FEED, api.getMicAnswer);

/**
 * 피드 저장
 */
function* saveMicFeed({ payload }) {
    const { feed, callback } = payload;
    const ACTION = act.SAVE_MIC_FEED;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(feed.answSeq ? api.putMicAnswer : api.postMicAnswer, { answer: feed });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_MIC_FEED_SUCCESS,
                payload: { body: feed },
            });
            // 목록 다시 조회
            const search = yield select(({ mic }) => mic.feed.search);
            yield put({
                type: act.GET_MIC_FEED_LIST,
                payload: { search },
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
 * 답변(피드, 포스트) 최상위 수정
 */
const putMicAnswerTop = createRequestSaga(act.PUT_MIC_ANSWER_TOP, api.putMicAnswerTop, true);

/**
 * 답변(피드, 포스트) 사용여부 수정
 */
const putMicAnswerUsed = createRequestSaga(act.PUT_MIC_ANSWER_USED, api.putMicAnswerUsed, true);

/**
 * 답변(피드, 포스트) 상태 수정
 */
const putMicAnswerDiv = createRequestSaga(act.PUT_MIC_ANSWER_DIV, api.putMicAnswerDiv, true);

/**
 * 포스트 목록 조회
 */
const getMicPostList = createRequestSaga(act.GET_MIC_POST_LIST, api.getMicAnswerList);

/**
 * 포스트 상세 조회
 */
const getMicPost = createRequestSaga(act.GET_MIC_POST, api.getMicAnswer);

/**
 * 포스트 저장
 */
function* saveMicPost({ payload }) {
    const { post, callback } = payload;
    const ACTION = act.SAVE_MIC_POST;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.putMicAnswerRel, post);
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_MIC_POST_SUCCESS,
                payload: { body: post },
            });
            // 목록 다시 조회
            const search = yield select(({ mic }) => mic.post.search);
            yield put({
                type: act.GET_MIC_POST_LIST,
                payload: { search },
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

export default function* saga() {
    yield takeLatest(act.GET_MIC_AGENDA_LIST, getMicAgendaList);
    yield takeLatest(act.GET_MIC_REPORT, getMicReport);
    yield takeLatest(act.GET_MIC_AGENDA_LIST_MODAL, getMicAgendaListModal);
    yield takeLatest(act.PUT_MIC_AGENDA_SORT, putMicAgendaSort);
    yield takeLatest(act.GET_MIC_CATEGORY_LIST, getMicCategoryList);
    yield takeLatest(act.SAVE_MIC_CATEGORY, saveMicCategory);
    yield takeLatest(act.GET_MIC_BANNER_LIST_MODAL, getMicBannerListModal);
    yield takeLatest(act.SAVE_MIC_BANNER, saveBanner);
    yield takeLatest(act.PUT_MIC_BANNER_TOGGLE, putMicBannerToggle);
    yield takeLatest(act.GET_MIC_AGENDA, getMicAgenda);
    yield takeLatest(act.SAVE_MIC_AGENDA, saveMicAgenda);
    yield takeLatest(act.GET_MIC_FEED_LIST, getMicFeedList);
    yield takeLatest(act.PUT_MIC_ANSWER_TOP, putMicAnswerTop);
    yield takeLatest(act.PUT_MIC_ANSWER_USED, putMicAnswerUsed);
    yield takeLatest(act.GET_MIC_FEED, getMicFeed);
    yield takeLatest(act.SAVE_MIC_FEED, saveMicFeed);
    yield takeLatest(act.GET_MIC_POST_LIST, getMicPostList);
    yield takeLatest(act.GET_MIC_POST, getMicPost);
    yield takeLatest(act.PUT_MIC_ANSWER_DIV, putMicAnswerDiv);
    yield takeLatest(act.SAVE_MIC_POST, saveMicPost);
}
