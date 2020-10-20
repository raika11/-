import { call, put, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';

import * as act from './componentAction';
import * as api from './componentApi';

/**
 * 여러개의 컴포넌트 한번에 저장
 * @param {array} param0.payload.componentList 컴포넌트리스트
 * @param {func} param0.payload.callback 콜백
 */
export function* saveComponentList({ payload: { componentList, callback } }) {
    let ACTION = act.SAVE_COMPONENT_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        if (componentList.length > 0) {
            // 컴포넌트 여러개 저장하는 api 호출
            const response = yield call(api.postAllComponents, { componentList });
            callbackData = response.data;
        } else {
            callbackData = { header: { success: false, message: '등록할 컴포넌트가 없습니다' }, body: null };
        }
    } catch (e) {
        callbackData = { header: { success: false, message: '저장하지 못했습니다' }, body: e };
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

export default function* saga() {
    yield takeLatest(act.SAVE_COMPONENT_LIST, saveComponentList);
}
