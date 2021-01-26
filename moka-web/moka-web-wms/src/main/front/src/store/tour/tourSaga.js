import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './tourApi';
import * as act from './tourAction';

/**
 * 메세지 목록조회
 */
const getTourGuideList = createRequestSaga(act.GET_TOUR_GUIDE_LIST, api.getTourGuideList);
export default function* saga() {
    yield takeLatest(act.GET_TOUR_GUIDE_LIST, getTourGuideList);
}
