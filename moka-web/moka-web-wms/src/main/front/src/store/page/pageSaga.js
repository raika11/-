import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './pageApi';
import * as act from './pageAction';

/**
 * 페이지 목록 조회
 */
const getPageTree = callApiAfterActions(act.GET_PAGE_TREE, api.getPageTree, (store) => store.page);

/**
 * 페이지 조회
 */
// const getPage = ({ payload: { param, callback } }) => callApiWithParam(act.GET_PAGE, api.getPage, param, callback);
const getPage = createRequestSaga(act.GET_PAGE, api.getPage);

/**
 * 저장
 */
function* savePage({ payload: { actions, callback } }) {
    const ACTION = act.SAVE_PAGE;
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
        const pageData = yield select((store) => store.page.page);
        const pageBody = yield select((store) => store.page.pageBody);

        // 등록/수정 분기
        if (pageData.pageSeq) {
            response = yield call(api.putPage, { page: { ...pageData, pageBody } });
        } else {
            response = yield call(api.postPage, { page: { ...pageData, pageBody } });
        }

        if (response.data.header.success) {
            callbackData = response.data;

            // 성공 액션 실행
            yield put({
                type: act.GET_PAGE_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_PAGE_TREE });
        } else {
            callbackData = response.data;

            // 실패 액션 실행
            yield put({
                type: act.GET_PAGE_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 실패 액션 실행
        yield put({
            type: act.GET_PAGE_FAILURE,
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
export function* deletePage({ payload: { pageSeq, callback } }) {
    const ACTION = act.DELETE_PAGE;
    const SUCCESS = act.DELETE_PAGE_SUCCESS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deletePage, { pageSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_PAGE_TREE });
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
 * 관련아이템 목록 조회
 * @param {string} param0.payload.relType PG|SK|CT|CP
 * @param {array} param0.payload.actions api 호출 전 액션
 */
function* getRelationList({ payload: { actions, relType } }) {
    const ACTION = act.GET_RELATION_LIST;

    yield put(startLoading(ACTION));

    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                if (act) {
                    yield put({
                        type: act.type,
                        payload: act.payload,
                    });
                }
            }
        }
        // 검색 조건
        const searchOption = yield select((store) => store.pageRelationList[relType]);
        const response = yield call(api.getRelationList, searchOption);

        if (response.data.header.success) {
            yield put({
                type: act.GET_RELATION_LIST_SUCCESS,
                payload: { ...response.data, relType },
            });
        } else {
            yield put({
                type: act.GET_RELATION_LIST_FAILURE,
                payload: { relType, payload: response.data },
            });
        }
    } catch (e) {
        yield put({
            type: act.GET_RELATION_LIST_FAILURE,
            payload: { relType, payload: errorResponse(e) },
        });
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
    yield takeLatest(act.GET_PAGE_TREE, getPageTree);
    yield takeLatest(act.GET_PAGE, getPage);
    yield takeLatest(act.SAVE_PAGE, savePage);
    yield takeLatest(act.DELETE_PAGE, deletePage);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_RELATION_LIST, getRelationList);
    yield takeLatest(act.GET_HISTORY_LIST, getHistoryList);
    yield takeLatest(act.GET_HISTORY, getHistory);
}
