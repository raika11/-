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
            payload: e,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/** saga */
export default function* saga() {
    yield takeLatest(act.getTemplateList, getTemplateList);
    yield takeLatest(act.getTemplate, getTemplate);
    yield takeLatest(act.saveTemplate, saveTemplate);
}
