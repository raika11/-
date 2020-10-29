import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga } from '../commons/saga';

import * as act from './datasetAction';
import * as api from './datasetApi';

const getDatasetList = callApiAfterActions(act.getDatasetList, api.getDatasetList, (store) => store.dataset);

/**
 * 데이터셋 리스트 조회(모달에서 사용하는 리스트)
 */
const getDatasetListModal = createRequestSaga(act.GET_DATASET_LIST_MODAL, api.getDatasetList, true);

export default function* saga() {
    yield takeLatest(act.GET_DATASET_LIST, getDatasetList);
    yield takeLatest(act.GET_DATASET_LIST_MODAL, getDatasetListModal);
}
