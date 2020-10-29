import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as datasetAction from './datasetAction';
import * as datasetAPI from './datasetApi';

const getDatasetList = callApiAfterActions(datasetAction.getDatasetList, datasetAPI.getDatasetList, (store) => store.dataset);
const getDataset = createRequestSaga(datasetAction.GET_DATASET, datasetAPI.getDataset);

export default function* saga() {
    yield takeLatest(datasetAction.GET_DATASET_LIST, getDatasetList);
    yield takeLatest(datasetAction.GET_DATASET, getDataset);
}
