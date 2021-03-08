import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import * as datasetAction from './datasetAction';
import * as datasetAPI from './datasetApi';

const getDatasetList = callApiAfterActions(datasetAction.getDatasetList, datasetAPI.getDatasetList, ({ dataset }) => dataset);
const getDataset = createRequestSaga(datasetAction.GET_DATASET, datasetAPI.getDataset);

/**
 * 데이터셋 리스트 조회(모달에서 사용하는 리스트)
 */
const getDatasetListModal = createRequestSaga(datasetAction.GET_DATASET_LIST_MODAL, datasetAPI.getDatasetList, true);
const getDatasetApiList = createRequestSaga(datasetAction.GET_DATASET_API_LIST, datasetAPI.getApiList, true);

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveDataset({ payload: { type, actions, callback } }) {
    const ACTION = datasetAction.SAVE_DATASET;
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
        let dataset = yield select(({ dataset }) => dataset.dataset);
        const dataApiParam =
            dataset.dataApiParam !== ''
                ? JSON.stringify(dataset.dataApiParam, (key, value) => {
                      if (value !== null) return value;
                  })
                : dataset.dataApiParam;

        dataset = {
            ...dataset,
            dataApiParam: dataApiParam,
            dataApiParamShape: null,
        };
        const response = type === 'insert' ? yield call(datasetAPI.postDataset, { dataset }) : yield call(datasetAPI.putDataset, { dataset });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: datasetAction.GET_DATASET_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: datasetAction.GET_DATASET_LIST });
        } else {
            yield put({
                type: datasetAction.GET_DATASET_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: datasetAction.GET_DATASET_FAILURE,
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
 */
function* deleteDataset({ payload: { datasetSeq, callback } }) {
    const ACTION = datasetAction.DELETE_DATASET;
    const SUCCESS = datasetAction.DELETE_DATASET_SUCCESS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(datasetAPI.deleteDataset, datasetSeq);
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: datasetAction.GET_DATASET_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData, datasetSeq);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 복사
 */
function* copyDataset({ payload: { datasetSeq, datasetName, callback } }) {
    const ACTION = datasetAction.COPY_DATASET;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(datasetAPI.copyDataset, { datasetSeq, datasetName });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: datasetAction.GET_DATASET_LIST });
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
 * 관련 아이템 여부 조회
 */
const hasRelationList = createRequestSaga(datasetAction.HAS_RELATION_LIST, datasetAPI.hasRelationList, true);

export default function* saga() {
    yield takeLatest(datasetAction.GET_DATASET_LIST, getDatasetList);
    yield takeLatest(datasetAction.GET_DATASET, getDataset);
    yield takeLatest(datasetAction.GET_DATASET_LIST_MODAL, getDatasetListModal);
    yield takeLatest(datasetAction.GET_DATASET_API_LIST, getDatasetApiList);
    yield takeLatest(datasetAction.SAVE_DATASET, saveDataset);
    yield takeLatest(datasetAction.hasRelationList, hasRelationList);
    yield takeLatest(datasetAction.deleteDataset, deleteDataset);
    yield takeLatest(datasetAction.COPY_DATASET, copyDataset);
}
