import { call, put, select, takeLatest } from 'redux-saga/effects';
import { finishLoading, startLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as editFormApi from './editFormApi';
import * as editFormAction from './editFormAction';

/**
 * 목록
 */
const getEditFormList = callApiAfterActions(editFormAction.GET_EDIT_FORM_LIST, editFormApi.getEditFormList, (state) => state.editForm);

/**
 * 데이터 조회
 */
const getEditForm = createRequestSaga(editFormAction.GET_EDIT_FORM, editFormApi.getEditForm);

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveEditForm({ payload: { type, formSeq, partSeq, actions, callback } }) {
    const ACTION = editFormAction.SAVE_EDIT_FORM;
    let callbackData = {};

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

        // 도메인 데이터
        const editForm = yield select((store) => store.editForm.editForm);
        const response =
            type === 'insert' ? yield call(editFormApi.postEditForm, { formSeq, partSeq, editForm }) : yield call(editFormApi.putEditForm, { formSeq, partSeq, editForm });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: editFormAction.GET_EDIT_FORM_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: editFormAction.GET_EDIT_FORM_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getEditForms(edit.channelId));
        } else {
            yield put({
                type: editFormAction.GET_EDIT_FORM_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: editFormAction.GET_EDIT_FORM_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveEditFormPart({ payload: { type, formSeq, partSeq, partJson, callback } }) {
    const ACTION = editFormAction.SAVE_EDIT_FORM;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response =
            type === 'insert' ? yield call(editFormApi.postEditForm, { formSeq, partSeq, partJson }) : yield call(editFormApi.putEditForm, { formSeq, partSeq, partJson });
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
 * 삭제
 * @param {string} param0.payload.formSeq 폼일련번호
 * @param {func} param0.payload.callback 콜백
 */
function* deleteEditForm({ payload: { formSeq, callback } }) {
    const ACTION = editFormAction.DELETE_EDIT_FORM;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(editFormApi.deleteEditForm, { formSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: editFormAction.DELETE_EDIT_FORM_SUCCESS });

            // 목록 다시 검색
            yield put({ type: editFormAction.GET_EDIT_FORM_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getEditFormList());
        } else {
            yield put({
                type: editFormAction.DELETE_EDIT_FORM_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: editFormAction.DELETE_EDIT_FORM_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 목록
 */
const getEditFormHistoryList = callApiAfterActions(editFormAction.GET_EDIT_FORM_HISTORY_LIST, editFormApi.getEditFormHistoryList, (state) => state.editForm);

/**
 * 편집폼 XML Export
 */
const exportEditFormXml = createRequestSaga(editFormAction.EXPORT_EDIT_FROM_XML, editFormApi.exportEditFormXml);

/**
 * 편집폼 Part XML Export
 */
const exportEditFormPartXml = createRequestSaga(editFormAction.EXPORT_EDIT_FROM_PART_XML, editFormApi.exportEditFormPartXml, (part) => part);

/**
 * 편집폼 Part XML Export
 */
const exportEditFormPartHistoryXml = createRequestSaga(editFormAction.EXPORT_EDIT_FROM_PART_HISTORY_XML, editFormApi.exportEditFormPartHistoryXml, (history) => history);

/**
 * xml 파일 import
 * @param {array} param0.payload.xmlFile 업로드 파일
 * @param {func} param0.payload.callback 콜백
 */
function* importEditFormXmlFile({ payload: { xmlFile, importForm, callback } }) {
    const ACTION = editFormAction.SAVE_EDIT_FORM_XML;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(editFormApi.importEditFormXmlFile, { xmlFile, importForm });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            yield put({ type: editFormAction.GET_EDIT_FORM_LIST });
        } else {
            yield put({
                type: editFormAction.GET_EDIT_FORM_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: editFormAction.GET_EDIT_FORM_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* editSaga() {
    yield takeLatest(editFormAction.GET_EDIT_FORM_LIST, getEditFormList);
    yield takeLatest(editFormAction.GET_EDIT_FORM, getEditForm);
    yield takeLatest(editFormAction.SAVE_EDIT_FORM, saveEditForm);
    yield takeLatest(editFormAction.SAVE_EDIT_FORM_PART, saveEditFormPart);
    yield takeLatest(editFormAction.DELETE_EDIT_FORM, deleteEditForm);
    yield takeLatest(editFormAction.GET_EDIT_FORM_HISTORY_LIST, getEditFormHistoryList);
    yield takeLatest(editFormAction.EXPORT_EDIT_FROM_XML, exportEditFormXml);
    yield takeLatest(editFormAction.EXPORT_EDIT_FROM_PART_XML, exportEditFormPartXml);
    yield takeLatest(editFormAction.EXPORT_EDIT_FROM_PART_HISTORY_XML, exportEditFormPartHistoryXml);
    yield takeLatest(editFormAction.SAVE_EDIT_FORM_XML, importEditFormXmlFile);
}
