import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './templateApi';
import * as act from './templateAction';

let message = {};

/**
 * 템플릿 목록 조회
 */
export const getTemplateList = callApiAfterActions(act.getTemplateList, api.getTemplateList, (store) => store.template);

/**
 * 템플릿 조회
 */
export const getTemplate = createRequestSaga(act.getTemplate, api.getTemplate);

/**
 * 저장
 */
export function* saveTemplate({ payload: { actions, callback } }) {
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
        callbackData = e;

        // 실패 액션 실행
        yield put({
            type: act.GET_TEMPLATE_FAILURE,
            payload: { header: { success: false }, body: e },
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 복사
 */
export function* copyTemplate({ payload: { templateSeq, templateName, domainId, callback } }) {
    const ACTION = act.COPY_TEMPLATE;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.copyTemplate, { templateSeq, templateName, domainId });

        if (response.header.success) {
            callbackData = response.data;

            // 검색조건 변경
            yield put({
                type: act.CHANGE_SEARCH_OPTION,
                payload: { key: 'domainId', value: domainId },
            });

            // 목록 다시 검색
            yield put({ type: act.GET_TEMPLATE_LIST });
        } else {
            callbackData = response.data;
        }
    } catch (e) {
        callbackData = { header: { success: false }, body: e };
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
export function* hasRelationList({ payload: { templateSeq, callback, exist, notExist } }) {
    const ACTION = act.HAS_RELATION_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.hasRelationList, { templateSeq });

        if (response.data.header.success) {
            callbackData = response.data;
        }
    } catch (e) {
        callbackData = { header: { success: false }, body: e };
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
export function* getRelationList({ payload: { actions, relType } }) {
    const sagaFunc = callApiAfterActions(act.GET_RELATION_LIST, api.getRelationList, (state) => state.templateRelations[relType]);
    yield call(sagaFunc, { payload: actions });
}

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_TEMPLATE_LIST, getTemplateList);
    yield takeLatest(act.GET_TEMPLATE, getTemplate);
    yield takeLatest(act.SAVE_TEMPLATE, saveTemplate);
    yield takeLatest(act.COPY_TEMPLATE, copyTemplate);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_RELATION_LIST, getRelationList);
}
