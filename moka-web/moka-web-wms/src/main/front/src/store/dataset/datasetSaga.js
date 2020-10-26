import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './datasetAction';
import * as api from './datasetApi';

const getDatasetList = callApiAfterActions(act.getDatasetList, api.getDatasetList, (store) => {
    console.log(store.dataset);
    return store.dataset;
});

export default function* saga() {
    yield takeLatest(act.GET_DATASET_LIST, getDatasetList);
}
