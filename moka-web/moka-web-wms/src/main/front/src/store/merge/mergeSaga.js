import { call, put, takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import produce from 'immer';

import * as api from './mergeApi';
import * as act from './mergeAction';

/**
 * TEMS 문법 체크
 */
const checkSyntax = createRequestSaga(act.CHECK_SYNTAX, api.checkSyntax, true);

/**
 * 기사 페이지 미리보기
 */
const previewArticlePage = createRequestSaga(act.PREVIEW_ARTICLE_PAGE, api.postPreviewAP, true);

/**
 * 페이지 W3C검사
 */
function* w3cPageSaga(action) {
    yield put(startLoading(act.W3C_PAGE)); // 로딩 시작
    let callbackData = {};
    let message = '';
    const { content, page, callback } = action.payload;

    try {
        const resSyntax = yield call(api.checkSyntax, { content });
        callbackData = resSyntax.data;

        if (resSyntax.data.header.success) {
            // 랜더링된 html받아온다
            const resPreview = yield call(api.postPreviewPG, { page });
            callbackData = resPreview.data;

            if (!resPreview.data.header.success) {
                message = '랜더링에 오류가 있어 W3C검사에 실패했습니다.';
            }
        } else {
            message = '문법에 오류가 있어 W3C검사에 실패했습니다.';
        }
    } catch (e) {
        message = 'W3C검사에 실패했습니다.';
    }

    yield put(finishLoading(act.W3C_PAGE)); // 로딩 끝

    // 에러가 있을 경우, 메세지 수정.
    callbackData = produce(callbackData, (draft) => {
        if (!draft.header.success) {
            draft.header.message = message;
        }
    });

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
}

/**
 * 기사페이지 W3C검사
 */
function* w3cArticlePageSaga(action) {
    yield put(startLoading(act.W3C_ARTICLE_PAGE)); // 로딩 시작
    let callbackData = {};
    let message = '';
    const { content, articlePage, totalId, callback } = action.payload;

    try {
        const resSyntax = yield call(api.checkSyntax, { content });
        callbackData = resSyntax.data;

        if (resSyntax.data.header.success) {
            // 랜더링된 html받아온다
            const resPreview = yield call(api.postPreviewAP, { articlePage, totalId });
            callbackData = resPreview.data;

            if (!resPreview.data.header.success) {
                message = '랜더링에 오류가 있어 W3C검사에 실패했습니다.';
            }
        } else {
            message = '문법에 오류가 있어 W3C검사에 실패했습니다.';
        }
    } catch (e) {
        message = 'W3C검사에 실패했습니다.';
    }

    yield put(finishLoading(act.W3C_ARTICLE_PAGE)); // 로딩 끝

    // 에러가 있을 경우, 메세지 수정.
    callbackData = produce(callbackData, (draft) => {
        if (!draft.header.success) {
            draft.header.message = message;
        }
    });

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
}

/**
 * 컴포넌트 미리보기
 */
const previewComponent = createRequestSaga(act.PREVIEW_COMPONENT, api.getPreviewCP);

const previewComponentModal = createRequestSaga(act.PREVIEW_COMPONENT_MODAL, api.getPreviewCP, true);

/**
 * 편집영역 미리보기
 */
const previewArea = createRequestSaga(act.PREVIEW_AREA, api.getPreviewArea);

const previewAreaModal = createRequestSaga(act.PREVIEW_AREA_MODAL, api.getPreviewArea, true);

/** saga */
export default function* saga() {
    yield takeLatest(act.CHECK_SYNTAX, checkSyntax);
    yield takeLatest(act.W3C_PAGE, w3cPageSaga);
    yield takeLatest(act.W3C_ARTICLE_PAGE, w3cArticlePageSaga);
    yield takeLatest(act.PREVIEW_COMPONENT, previewComponent);
    yield takeLatest(act.PREVIEW_COMPONENT_MODAL, previewComponentModal);
    yield takeLatest(act.PREVIEW_AREA, previewArea);
    yield takeLatest(act.PREVIEW_AREA_MODAL, previewAreaModal);
    yield takeLatest(act.PREVIEW_ARTICLE_PAGE, previewArticlePage);
}
