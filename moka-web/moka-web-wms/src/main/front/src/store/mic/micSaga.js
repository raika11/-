import { takeLatest, put, call, select } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './micApi';
import * as act from './micAction';

/**
 * 아젠다 목록 조회
 */
const getMicAgendaList = createRequestSaga(act.GET_MIC_AGENDA_LIST, api.getMicAgendaList);

/**
 * 아젠다 목록 조회(모달)
 */
const getMicAgendaListModal = createRequestSaga(act.GET_MIC_AGENDA_LIST_MODAL, api.getMicAgendaList, true);

/**
 * 아젠다, 전체 포스트 수
 */
const getMicReport = createRequestSaga(act.GET_MIC_REPORT, api.getMicReport);

export default function* saga() {
    yield takeLatest(act.GET_MIC_AGENDA_LIST, getMicAgendaList);
    yield takeLatest(act.GET_MIC_REPORT, getMicReport);
    yield takeLatest(act.GET_MIC_AGENDA_LIST_MODAL, getMicAgendaListModal);
}
