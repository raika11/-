import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './templateApi';
import * as act from './templateAction';

let message = {};

/** 템플릿 목록 조회 */
export const getTemplateList = callApiAfterActions(act.getTemplateList, api.getTemplateList, (store) => store.template);

export const getTemplate = createRequestSaga(act.getTemplate, api.getTemplate);

/** saga */
export default function* saga() {
    yield takeLatest(act.getTemplateList, getTemplateList);
    yield takeLatest(act.getTemplate, getTemplate);
}
