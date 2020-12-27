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
const getMappingList = createRequestSaga(act.GET_MAPPING_SOURCE_LIST, api.getMappingList);

/**
 * 벌크 매체 목록 조회
 */
const getBulkSourceList = createRequestSaga(act.GET_BLUK_SOURCE_LIST, api.getBulkSourceList);

export default function* saga() {
    yield takeLatest(act.GET_DESKING_SOURCE_LIST, getDeskingSourceList);
    yield takeLatest(act.GET_TYPE_SOURCE_LIST, getTypeSourceList);
    yield takeLatest(act.GET_SOURCE_LIST, getSourceList);
    yield takeLatest(act.GET_ARTICLE_SOURCE, getArticleSource);
    yield takeLatest(act.SAVE_ARTICLE_SOURCE, saveArticleSource);
    yield takeLatest(act.GET_MAPPING_SOURCE_LIST, getMappingList);
    yield takeLatest(act.GET_BLUK_SOURCE_LIST, getBulkSourceList);
}
