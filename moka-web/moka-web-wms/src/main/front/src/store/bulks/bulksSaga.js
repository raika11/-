import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
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
    GET_MODAL_BULK_ARTICLE,
    GET_HOTCLICK_TITLE,
    GET_HOTCLICK_TITLE_SUCCESS,
    SAVE_HOTCLICK,
    RESEND_HOTCLICK,
    GET_HOTCLICK_HISTORY_LIST,
    GET_HISTORY_DETAIL,
    GET_HISTORY_DETAIL_SUCCESS,
    GET_HOTCLICK_LIST,
    GET_HOTCLICK_LIST_SUCCESS,
} from './bulksAction';
import { getBulkList, getBulkArticle, saveBulkArticle, getSpecialchar, putSpecialchar, putChangeBulkused, getCopyright, resendHotClick } from './bulksApi';

// 벌크 리스트 가지고 오기.
const getBulkListSaga = callApiAfterActions(GET_BULK_LIST, getBulkList, (state) => state.bulks.bulkn);
// 핫클릭 히스토리 가지고 오기.
const getHotClickHistoryListSaga = callApiAfterActions(GET_HOTCLICK_HISTORY_LIST, getBulkList, (state) => state.bulks.bulkh.historyList);
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
        const {
            header: { success },
            body: {
                LIST: { list },
                bulk,
            },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_BULK_ARTICLE_SUCCESS, payload: { list: list, bulk: bulk } });
        } else {
            yield put({ type: GET_BULK_ARTICLE_FAILURE, payload: response.data.body });
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

// 벌크 상세 정보 ( 기사리스트 미리 보기 모달용)
function* getModalBulkArticleSaga({ payload: { bulkartSeq, callback } }) {
    yield put(startLoading(GET_MODAL_BULK_ARTICLE));

    let callbackData = {};
    let response;
    let getData = {
        bulkartSeq: bulkartSeq,
    };

    try {
        response = yield call(getBulkArticle, getData);
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

    yield put(finishLoading(GET_MODAL_BULK_ARTICLE));
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
        // const { bulkartDiv, sourceCode } = yield select((store) => store.bulks);

        response = yield call(putChangeBulkused, {
            bulkartSeq: bulkartSeq,
            // parameter: {
            //     bulkartDiv: bulkartDiv,
            //     sourceCode: sourceCode,
            //     bulkartSeq: bulkartSeq,
            //     usedYn: 'Y',
            //     status: 'publish',
            // },
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

// 아티클 핫클릭 상단 타이틀 가지고 오기.
function* getHotClickTopTitleSaga() {
    yield put(startLoading(GET_HOTCLICK_TITLE));
    const { bulkartDiv, sourceCode } = yield select((store) => store.bulks);

    try {
        // 아티클 상단 타이틀이 전송, 대기 두개 이기 때문에 api 를 두번 호출.
        // 전송 타이틀 가지고 오기.

        const {
            data: {
                body: { list: sendResultList },
            },
        } = yield call(getBulkList, {
            search: {
                page: 0,
                size: 1,
                bulkartDiv: bulkartDiv,
                sourceCode: sourceCode,
                usedYn: 'Y',
                status: 'publish',
            },
        });

        // 대기 타이틀 가지고 오기.
        const {
            data: {
                body: { list: waitResultList },
            },
        } = yield call(getBulkList, {
            search: {
                page: 0,
                size: 1,
                bulkartDiv: bulkartDiv,
                sourceCode: sourceCode,
                usedYn: 'N',
                status: 'save',
            },
        });
        yield put({
            type: GET_HOTCLICK_TITLE_SUCCESS,
            payload: {
                send: Array.isArray(sendResultList) ? sendResultList[0] : sendResultList,
                wait: Array.isArray(waitResultList) ? waitResultList[0] : waitResultList,
            },
        });
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(GET_HOTCLICK_TITLE));
}

// 핫클릭 저장, 임시저장.
function* saveHotclickSaga({ payload: { type, hotclicklist, callback } }) {
    yield put(startLoading(SAVE_HOTCLICK));

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
            validList: hotclicklist,
        };

        response = yield call(saveBulkArticle, { PostData });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(SAVE_HOTCLICK));
}

// 핫클릭 재전송.
function* saveHotclickResendSaga({ payload: { bulkartSeq, callback } }) {
    yield put(startLoading(RESEND_HOTCLICK));

    let callbackData = {};
    let response;

    try {
        response = yield call(resendHotClick, {
            bulkartSeq: bulkartSeq,
        });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(RESEND_HOTCLICK));
}

// 히스토리 상세.
function* getHistoryDetailSaga({ payload: bulkartSeq }) {
    yield put(startLoading(GET_HISTORY_DETAIL));
    try {
        const response = yield call(getBulkArticle, {
            bulkartSeq: bulkartSeq,
        });
        const {
            header: { success },
            body,
        } = response.data;
        if (success === true) {
            yield put({ type: GET_HISTORY_DETAIL_SUCCESS, payload: { bulkartSeq: bulkartSeq, body: body } });
        } else {
            toast.error(response.data.header.message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(GET_HISTORY_DETAIL));
}

// 핫클릭 리스트 가지고 오기.
function* getHotclickListSaga({ payload: bulkartSeq }) {
    yield put(startLoading(GET_HOTCLICK_LIST));
    try {
        const response = yield call(getBulkArticle, {
            bulkartSeq: bulkartSeq,
        });
        const {
            header: { success },
            body,
        } = response.data;
        if (success === true) {
            yield put({ type: GET_HOTCLICK_LIST_SUCCESS, payload: body });
        } else {
            toast.error(response.data.header.message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(GET_HOTCLICK_LIST));
}

export default function* bulksSaga() {
    yield takeLatest(INITIALIZE_PARAMS, initializeParamsSaga); // 페이지 공통 구분 코드
    yield takeLatest(TRY_PREVIEW_MODAL, showPreviewModelSaga); // 벌크 에서 사용하는 미리보기 모달.
    yield takeLatest(GET_BULK_LIST, getBulkListSaga); // 벌크 리스트
    yield takeLatest(GET_BULK_ARTICLE, getBulkArticleSaga); // 벌크 상세 정보(기사들).
    yield takeLatest(GET_MODAL_BULK_ARTICLE, getModalBulkArticleSaga); // 벌크 상세 정보(기사들 미리 보기 모달용).
    yield takeLatest(SAVE_BULK_ARTICLE, saveBulkArticleSaga); // 벌크 문구 저장(기사들).
    yield takeLatest(GET_SPECIALCHAR, getSpecialcharSaga); // 약물정보 가지고 오기.
    yield takeLatest(GET_COPYRIGHT, getCopyrightSaga); // Copyright 가지고 오기.
    yield takeLatest(SAVE_SPECIALCHAR, saveSpecialcharSaga); // 약물 정보 저장.
    yield takeLatest(CHANGE_BULKUSED, changeBulkusedSaga); // 벌크 상태 변경.

    // 아티클 핫클릭.
    yield takeLatest(GET_HOTCLICK_TITLE, getHotClickTopTitleSaga); // 벌크 상태 변경.
    yield takeLatest(SAVE_HOTCLICK, saveHotclickSaga); // 핫클릭 저장 및 임시저장.
    yield takeLatest(RESEND_HOTCLICK, saveHotclickResendSaga); // 핫클릭 재전송.
    yield takeLatest(GET_HOTCLICK_HISTORY_LIST, getHotClickHistoryListSaga); // 핫클릭 히스토리 리스트.
    yield takeLatest(GET_HISTORY_DETAIL, getHistoryDetailSaga); // 핫클릭 히스토리 불러오기.
    yield takeLatest(GET_HOTCLICK_LIST, getHotclickListSaga); // 핫클릭 리스트 가지고 오기.
}
