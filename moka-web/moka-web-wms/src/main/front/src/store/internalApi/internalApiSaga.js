import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './internalApiAction';
import * as api from './internalApiApi';

/**
 * api 목록 조회
 */
const getInternalApiList = createRequestSaga(act.GET_INTERNAL_API_LIST, api.getInternalApiList);

export default function* saga() {
    yield takeLatest(act.GET_INTERNAL_API_LIST, getInternalApiList);
}
