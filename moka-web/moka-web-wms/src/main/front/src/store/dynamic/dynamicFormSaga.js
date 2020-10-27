import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as dynamicFormApi from './dynamicFormApi';
import * as dynamicFormAction from './dynamicFormAction';

/**
 * 목록
 */
const getDynamicFormList = callApiAfterActions(dynamicFormAction.GET_DYNAMIC_LIST, dynamicFormApi.getDynamicFormList, (state) => state.dynamic);

/**
 * 데이터 조회
 */
const getDynamicForm = createRequestSaga(dynamicFormAction.GET_DYNAMIC, dynamicFormApi.getDynamicForm);

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveDynamicForm({ payload: { type, channelId, actions, callback } }) {
    const ACTION = dynamicFormAction.SAVE_DYNAMIC;
    let callbackData = {};

    yield put(startLoading(ACTION));
    console.log(channelId);
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

        // 도메인 데이터
        const dynamic = yield select((store) => store.dynamicForm.dynamicForm);
        const response = type === 'insert' ? yield call(dynamicFormApi.postDynamicForm, { channelId, dynamic }) : yield call(dynamicFormApi.putDynamicForm, { dynamic });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: dynamicFormAction.GET_DYNAMIC_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: dynamicFormAction.GET_DYNAMIC_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getDynamicForms(dynamic.dynamicId));
        } else {
            yield put({
                type: dynamicFormAction.GET_DYNAMIC_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: dynamicFormAction.GET_DYNAMIC_FAILURE,
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
 * @param {string} param0.payload.dynamicId 도메인아이디
 * @param {func} param0.payload.callback 콜백
 */
function* deleteDynamicForm({ payload: { dynamicId, callback } }) {
    const ACTION = dynamicFormAction.DELETE_DYNAMIC;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(dynamicFormApi.deleteDynamicForm, { dynamicId });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: dynamicFormAction.DELETE_DYNAMIC_SUCCESS });

            // 목록 다시 검색
            yield put({ type: dynamicFormAction.GET_DYNAMIC_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getDynamicFormList());
        } else {
            yield put({
                type: dynamicFormAction.DELETE_DYNAMIC_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: dynamicFormAction.DELETE_DYNAMIC_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* dynamicSaga() {
    yield takeLatest(dynamicFormAction.GET_DYNAMIC_LIST, getDynamicFormList);
    yield takeLatest(dynamicFormAction.GET_DYNAMIC, getDynamicForm);
    yield takeLatest(dynamicFormAction.SAVE_DYNAMIC, saveDynamicForm);
    yield takeLatest(dynamicFormAction.DELETE_DYNAMIC, deleteDynamicForm);
}
