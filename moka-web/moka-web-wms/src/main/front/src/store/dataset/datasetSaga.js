import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga } from '../commons/saga';

import * as datasetAction from './datasetAction';
import * as datasetAPI from './datasetApi';

const getDatasetList = callApiAfterActions(datasetAction.getDatasetList, datasetAPI.getDatasetList, (store) => store.dataset);
const getDataset = createRequestSaga(datasetAction.GET_DATASET, datasetAPI.getDataset);

/**
 * 데이터셋 리스트 조회(모달에서 사용하는 리스트)
 */
const getDatasetListModal = createRequestSaga(datasetAction.GET_DATASET_LIST_MODAL, datasetAPI.getDatasetList, true);

export default function* saga() {
    yield takeLatest(datasetAction.GET_DATASET_LIST, getDatasetList);
    yield takeLatest(datasetAction.GET_DATASET, getDataset);
    yield takeLatest(datasetAction.GET_DATASET_LIST_MODAL, getDatasetListModal);
}
