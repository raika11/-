import { takeLatest, put, select, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import {
    GET_BULK_LIST,
    INITIALIZE_PARAMS,
    INITIALIZED_PARAMS,
    TRY_PREVIEW_MODAL,
    SHOW_PREVIEW_MODAL,
    GET_BULK_ARTICLE,
    SAVE_BULK_ARTICLE,
    GET_SPECIALCHAR,
    CHANGE_INVALID_LINK,
    SAVE_SPECIALCHAR,
    CHANGE_BULKUSED,
    GET_BULK_ARTICLE_SUCCESS,
    GET_BULK_ARTICLE_FAILURE,
    GET_COPYRIGHT,
} from './bulksAction';
import { getBulkList, getBulkArticle, saveBulkArticle, getSpecialchar, putSpecialchar, putChangeBulkused, getCopyright } from './bulksApi';

// 벌크 리스트 가지고 오기.
const getBulkListSaga = callApiAfterActions(GET_BULK_LIST, getBulkList, (state) => state.bulks);
// 약물 정보 가지고 오기.
const getSpecialcharSaga = callApiAfterActions(GET_SPECIALCHAR, getSpecialchar, (state) => state.bulks);
const getCopyrightSaga = callApiAfterActions(GET_COPYRIGHT, getCopyright, (state) => state.bulks);

// 벌크 상세 정보 ( 기사리스트)
function* getBulkArticleSaga({ payload: { bulkartSeq, callback } }) {
    yield put(startLoading(GET_BULK_ARTICLE));

    let callbackData = {};
    let response;
    let getData = {
        bulkartSeq: bulkartSeq,
    };

    try {
        response = yield call(getBulkArticle, getData);
        callbackData = response.data;

        const {
            header: { success },
            body,
        } = response.data;
        if (success === true) {
            yield put({ type: GET_BULK_ARTICLE_SUCCESS, payload: response.data });
        } else {
            yield put({ type: GET_BULK_ARTICLE_FAILURE, payload: body });
        }
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: CHANGE_INVALID_LINK,
            payload: callbackData,
        });
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(GET_BULK_ARTICLE));
}

// 미리보기 모달 상태 변경.
function* showPreviewModelSaga({ payload }) {
    yield put({ type: SHOW_PREVIEW_MODAL, payload: payload });
}

// 페이지에서 사용할 공통 구분값 처리.
function* initializeParamsSaga({ payload }) {
    yield put({ type: INITIALIZED_PARAMS, payload: payload });
}

// 문구 기사들 저장.
function* saveBulkArticleSaga({ payload: { type, bulkArticle, callback } }) {
    yield put(startLoading(SAVE_BULK_ARTICLE));

    let callbackData = {};
    let response;

    try {
        const { bulkartDiv, sourceCode } = yield select((store) => store.bulks);

        const PostData = {
            parameter: {
                bulkartDiv: bulkartDiv,
                sourceCode: sourceCode,
                status: type,
            },
            validList: bulkArticle,
        };

        response = yield call(saveBulkArticle, { PostData });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: CHANGE_INVALID_LINK,
            payload: callbackData,
        });
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(SAVE_BULK_ARTICLE));
}

// 약물 정보 저장.
function* saveSpecialcharSaga({ payload: { specialchar, callback } }) {
    yield put(startLoading(SAVE_SPECIALCHAR));

    let callbackData = {};
    let response;

    try {
        response = yield call(putSpecialchar, {
            dtlCd: 'bulkChar',
            cdNm: specialchar,
        });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: CHANGE_INVALID_LINK,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(SAVE_SPECIALCHAR));
}

// 벌크 상태(서비스) 변경
function* changeBulkusedSaga({ payload: { bulkartSeq, callback } }) {
    yield put(startLoading(CHANGE_BULKUSED));

    let callbackData = {};
    let response;

    try {
        const { bulkartDiv, sourceCode } = yield select((store) => store.bulks);

        response = yield call(putChangeBulkused, {
            bulkartSeq: bulkartSeq,
            parameter: {
                bulkartDiv: bulkartDiv,
                sourceCode: sourceCode,
                bulkartSeq: bulkartSeq,
                status: 'publish',
            },
        });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: CHANGE_INVALID_LINK,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(CHANGE_BULKUSED));
}

export default function* bulksSaga() {
    yield takeLatest(INITIALIZE_PARAMS, initializeParamsSaga); // 페이지 공통 구분 코드
    yield takeLatest(TRY_PREVIEW_MODAL, showPreviewModelSaga); // 벌크 에서 사용하는 미리보기 모달.
    yield takeLatest(GET_BULK_LIST, getBulkListSaga); // 벌크 리스트
    yield takeLatest(GET_BULK_ARTICLE, getBulkArticleSaga); // 벌크 상세 정보(기사들).
    yield takeLatest(SAVE_BULK_ARTICLE, saveBulkArticleSaga); // 벌크 문구 저장(기사들).
    yield takeLatest(GET_SPECIALCHAR, getSpecialcharSaga); // 약물정보 가지고 오기.
    yield takeLatest(GET_COPYRIGHT, getCopyrightSaga); // Copyright 가지고 오기.
    yield takeLatest(SAVE_SPECIALCHAR, saveSpecialcharSaga); // 약물 정보 저장.
    yield takeLatest(CHANGE_BULKUSED, changeBulkusedSaga); // 벌크 상태 변경.
}
