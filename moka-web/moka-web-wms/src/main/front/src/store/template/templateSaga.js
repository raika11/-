import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './templateApi';
import * as act from './templateAction';

/**
 * 템플릿 목록 조회
 */
const getTemplateList = callApiAfterActions(act.GET_TEMPLATE_LIST, api.getTemplateList, (store) => store.template);

/**
 * 템플릿 조회
 */
const getTemplate = createRequestSaga(act.GET_TEMPLATE, api.getTemplate);

/**
 * 저장
 */
function* saveTemplate({ payload: { actions, callback } }) {
    const ACTION = act.SAVE_TEMPLATE;
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

        // 템플릿 데이터와 템플릿 바디
        const templateData = yield select((store) => store.template.template);
        const templateBody = yield select((store) => store.template.templateBody);

        // 등록/수정 분기
        if (templateData.templateSeq) {
            response = yield call(api.putTemplate, { template: { ...templateData, templateBody } });
        } else {
            response = yield call(api.postTemplate, { template: { ...templateData, templateBody } });
        }

        if (response.data.header.success) {
            callbackData = response.data;

            // 성공 액션 실행
            yield put({
                type: act.GET_TEMPLATE_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_TEMPLATE_LIST });
        } else {
            callbackData = response.data;

            // 실패 액션 실행
            yield put({
                type: act.GET_TEMPLATE_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 실패 액션 실행
        yield put({
            type: act.GET_TEMPLATE_FAILURE,
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
 * @param {string|number} param0.payload.templateSeq 템플릿ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
export function* deleteTemplate({ payload: { templateSeq, callback } }) {
    const ACTION = act.DELETE_TEMPLATE;
    const SUCCESS = act.DELETE_TEMPLATE_SUCCESS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteTemplate, { templateSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_TEMPLATE_LIST });
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
 * 복사
 */
function* copyTemplate({ payload: { templateSeq, templateName, domainId, callback } }) {
    const ACTION = act.COPY_TEMPLATE;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.copyTemplate, { templateSeq, templateName, domainId });
        callbackData = response.data;

        if (response.data.header.success) {
            // 검색조건 변경
            yield put({
                type: act.CHANGE_SEARCH_OPTION,
                payload: { key: 'domainId', value: domainId },
            });

            // 목록 다시 검색
            yield put({ type: act.GET_TEMPLATE_LIST });
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
 * @param {string|number} param0.payload.templateseq 템플릿ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
function* hasRelationList({ payload: { templateSeq, callback } }) {
    const ACTION = act.HAS_RELATION_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.hasRelationList, { templateSeq });
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
        const searchOption = yield select((store) => store.templateRelationList[relType]);
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
const getHistoryList = callApiAfterActions(act.GET_HISTORY_LIST, api.getHistoryList, (store) => store.templateHistory);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_TEMPLATE_LIST, getTemplateList);
    yield takeLatest(act.GET_TEMPLATE, getTemplate);
    yield takeLatest(act.SAVE_TEMPLATE, saveTemplate);
    yield takeLatest(act.DELETE_TEMPLATE, deleteTemplate);
    yield takeLatest(act.COPY_TEMPLATE, copyTemplate);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_RELATION_LIST, getRelationList);
    yield takeLatest(act.GET_HISTORY_LIST, getHistoryList);
}
