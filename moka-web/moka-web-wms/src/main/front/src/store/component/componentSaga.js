import { call, put, takeLatest, select } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading';

import * as act from './componentAction';
import * as api from './componentApi';

/**
 * 컴포넌트 목록 조회
 */
const getComponentList = callApiAfterActions(act.GET_COMPONENT_LIST, api.getComponentList, (store) => store.component);

/**
 * 컴포넌트 조회
 */
const getComponent = createRequestSaga(act.GET_COMPONENT, api.getComponent);

/**
 * 여러개의 컴포넌트 한번에 저장
 * @param {array} param0.payload.componentList 컴포넌트리스트
 * @param {func} param0.payload.callback 콜백
 */
function* saveComponentList({ payload: { componentList, callback } }) {
    let ACTION = act.SAVE_COMPONENT_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        // 컴포넌트 여러개 저장하는 api 호출
        const response = yield call(api.postAllComponents, { componentList });
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
 * 저장/수정
 * @param {array} param0.payload.actions 저장 전 액션리스트
 * @param {func} param0.payload.callback 콜백
 */
export function* saveComponent({ payload: { actions, callback } }) {
    let ACTION = act.SAVE_COMPONENT;
    let response,
        callbackData = {};

    yield put(startLoading(ACTION));
    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 컴포넌트 데이터
        const component = yield select((state) => state.component.component);

        // 등록/수정 분기
        if (component.componentSeq) {
            response = yield call(api.putComponent, { component });
        } else {
            response = yield call(api.postComponent, { component });
        }

        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_COMPONENT_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_COMPONENT_LIST });
        } else {
            yield put({
                type: act.GET_COMPONENT_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_COMPONENT_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 복사
 * @param {number} param0.payload.componentSeq 컴포넌트아이디
 * @param {string} param0.payload.componentName 컴포넌트명
 * @param {func} param0.payload.callback 콜백
 */
function* copyComponent({ payload: { componentSeq, componentName, callback } }) {
    const ACTION = act.COPY_COMPONENT;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.copyComponent, { componentSeq, componentName });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            yield put({ type: act.GET_COMPONENT_LIST });
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
 * 삭제
 * @param {string|number} param0.payload.componentSeq 컴포넌트ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
export function* deleteComponent({ payload: { componentSeq, callback } }) {
    const ACTION = act.DELETE_COMPONENT;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteComponent, { componentSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_COMPONENT_SUCCESS,
                payload: callbackData,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_COMPONENT_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData, componentSeq);
    }

    yield put(finishLoading(ACTION));
}

export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_LIST, getComponentList);
    yield takeLatest(act.GET_COMPONENT, getComponent);
    yield takeLatest(act.SAVE_COMPONENT_LIST, saveComponentList);
    yield takeLatest(act.SAVE_COMPONENT, saveComponent);
    yield takeLatest(act.COPY_COMPONENT, copyComponent);
    yield takeLatest(act.DELETE_COMPONENT, deleteComponent);
}
