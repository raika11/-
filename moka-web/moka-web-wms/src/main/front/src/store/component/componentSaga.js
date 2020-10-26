import { call, put, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading';

import * as act from './componentAction';
import * as api from './componentApi';

/**
 * 컴포넌트 목록 조회
 */
const getComponentList = callApiAfterActions(act.GET_COMPONENT_LIST, api.getComponentList, (store) => store.component);

/**
 * 템플릿 조회
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

export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_LIST, getComponentList);
    yield takeLatest(act.GET_COMPONENT, getComponent);
    yield takeLatest(act.SAVE_COMPONENT_LIST, saveComponentList);
}
