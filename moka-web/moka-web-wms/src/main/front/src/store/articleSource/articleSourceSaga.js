import { call, put, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as act from './articleSourceAction';
import * as api from './articleSourceApi';

/**
 * 데스킹 매체 목록 조회
 */
const getDeskingSourceList = createRequestSaga(act.GET_DESKING_SOURCE_LIST, api.getDeskingSourceList);

/**
 * 타입별 매체 목록 조회
 */
const getTypeSourceList = createRequestSaga(act.GET_TYPE_SOURCE_LIST, api.getTypeSourceList);

/**
 * 매체 목록 조회
 */
const getSourceList = callApiAfterActions(act.GET_SOURCE_LIST, api.getSourceList, (store) => store.articleSource);

/**
 * 매체 중복 체크
 * @param {string} param0.payload.sourceCode 매체 코드
 * @param {string} param0.payload.callback callback
 */
function* getSourceDuplicateCheck({ payload: { sourceCode, callback } }) {
    const ACTION = act.GET_SOURCE_DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.getSourceDuplicateCheck, { sourceCode, callback });
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
 * 매체 상세조회
 */
const getArticleSource = createRequestSaga(act.GET_ARTICLE_SOURCE, api.getArticleSource);

/**
 * 매체 등록, 수정
 */
function* saveArticleSource({ payload }) {
    const { source, callback } = payload;
    const ACTION = act.SAVE_ARTICLE_SOURCE;
    let response, callbackData;

    yield put(startLoading(ACTION));

    try {
        // 등록/수정 분기
        if (source.add) {
            response = yield call(api.postArticleSource, { source });
        } else {
            response = yield call(api.putArticleSource, { source });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_ARTICLE_SOURCE_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({
                type: act.GET_SOURCE_LIST,
            });
        } else {
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: response.data.body.list,
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
 * 매핑 목록 조회
 */
const getMappingList = callApiAfterActions(act.GET_MAPPING_CODE_LIST, api.getMappingList, (store) => store.articleSource);

/**
 * 매핑코드 중복 체크
 * @param {string} param0.payload.sourceCode 매체 코드
 * @param {string} param0.payload.frCode CP 코드
 * @param {string} param0.payload.callback callback
 */
function* getMappingCodeDuplicateCheck({ payload: { sourceCode, frCode, callback } }) {
    const ACTION = act.GET_MAPPING_CODE_DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.getMappingCodeDuplicateCheck, { sourceCode, frCode, callback });
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
 * 매핑코드 상세조회
 */
const getMappingCode = createRequestSaga(act.GET_MAPPING_CODE, api.getMappingCode);

/**
 * 매핑코드 등록, 수정
 */
function* saveMappingCode({ payload }) {
    const { mappingCode, callback } = payload;
    const ACTION = act.SAVE_MAPPING_CODE;
    let response, callbackData;

    yield put(startLoading(ACTION));

    try {
        // 등록/수정 분기
        if (!mappingCode.seqNo) {
            response = yield call(api.postMappingCode, { mappingCode });
        } else {
            response = yield call(api.putMappingCode, { mappingCode });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_MAPPING_CODE_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({
                type: act.GET_MAPPING_CODE_LIST,
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
 * 매핑코드 삭제
 * @param {number} param0.payload.sourceCode 매체코드
 * @param {function} param0.payload.seqNo 매핑순번
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteMappingCode({ payload: { sourceCode, seqNo, callback } }) {
    const ACTION = act.DELETE_MAPPING_CODE;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteMappingCode, { sourceCode, seqNo });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: act.DELETE_MAPPING_CODE_SUCCESS });

            // 목록 다시 검색
            yield put({ type: act.GET_MAPPING_CODE_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_MAPPING_CODE_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* saga() {
    yield takeLatest(act.GET_DESKING_SOURCE_LIST, getDeskingSourceList);
    yield takeLatest(act.GET_TYPE_SOURCE_LIST, getTypeSourceList);
    yield takeLatest(act.GET_SOURCE_LIST, getSourceList);
    yield takeLatest(act.GET_SOURCE_DUPLICATE_CHECK, getSourceDuplicateCheck);
    yield takeLatest(act.GET_ARTICLE_SOURCE, getArticleSource);
    yield takeLatest(act.SAVE_ARTICLE_SOURCE, saveArticleSource);
    yield takeLatest(act.GET_MAPPING_CODE_LIST, getMappingList);
    yield takeLatest(act.GET_MAPPING_CODE_DUPLICATE_CHECK, getMappingCodeDuplicateCheck);
    yield takeLatest(act.GET_MAPPING_CODE, getMappingCode);
    yield takeLatest(act.SAVE_MAPPING_CODE, saveMappingCode);
    yield takeLatest(act.DELETE_MAPPING_CODE, deleteMappingCode);
}
