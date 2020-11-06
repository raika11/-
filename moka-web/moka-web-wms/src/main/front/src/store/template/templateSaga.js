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
 * 템플릿 lookup 목록 조회
 */
const getTemplateLookupList = callApiAfterActions(act.GET_TEMPLATE_LOOKUP_LIST, api.getTemplateList, (store) => store.template.lookup);

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

            // invalidList 셋팅
            yield put({
                type: act.CHANGE_INVALID_LIST,
                payload: response.data.body.list,
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
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteTemplate, { templateSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: act.DELETE_TEMPLATE_SUCCESS,
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
 */
const hasRelationList = createRequestSaga(act.HAS_RELATION_LIST, api.hasRelationList, true);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_TEMPLATE_LIST, getTemplateList);
    yield takeLatest(act.GET_TEMPLATE, getTemplate);
    yield takeLatest(act.SAVE_TEMPLATE, saveTemplate);
    yield takeLatest(act.DELETE_TEMPLATE, deleteTemplate);
    yield takeLatest(act.COPY_TEMPLATE, copyTemplate);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_TEMPLATE_LOOKUP_LIST, getTemplateLookupList);
}
