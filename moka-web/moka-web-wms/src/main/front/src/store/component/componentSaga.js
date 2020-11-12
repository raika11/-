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
 * 컴포넌트 목록 조회(모달용 일시적인 데이터)
 */
const getComponentListModal = createRequestSaga(act.GET_COMPONENT_LIST_MODAL, api.getComponentList, true);

/**
 * 컴포넌트 lookup 목록 조회
 */
const getComponentLookupList = callApiAfterActions(act.GET_COMPONENT_LOOKUP_LIST, api.getComponentList, (store) => store.component.lookup);

/**
 * 컴포넌트 조회
 */
const getComponent = createRequestSaga(act.GET_COMPONENT, api.getComponent);

/**
 * 여러개의 컴포넌트 한번에 저장
 */
const saveComponentList = createRequestSaga(act.SAVE_COMPONENT_LIST, api.postAllComponents, true);

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

        if (response.data.header.success && response.data.body) {
            yield put({
                type: act.DELETE_COMPONENT_SUCCESS,
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

/**
 * 관련 아이템 체크
 */
const hasRelationList = createRequestSaga(act.HAS_RELATION_LIST, api.hasRelationList, true);

export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_LIST, getComponentList);
    yield takeLatest(act.GET_COMPONENT, getComponent);
    yield takeLatest(act.SAVE_COMPONENT_LIST, saveComponentList);
    yield takeLatest(act.SAVE_COMPONENT, saveComponent);
    yield takeLatest(act.COPY_COMPONENT, copyComponent);
    yield takeLatest(act.DELETE_COMPONENT, deleteComponent);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_COMPONENT_LOOKUP_LIST, getComponentLookupList);
    yield takeLatest(act.GET_COMPONENT_LIST_MODAL, getComponentListModal);
}
