import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './tourApi';
import * as act from './tourAction';

/**
 * 메세지 목록조회
 */
const getTourGuideList = createRequestSaga(act.GET_TOUR_GUIDE_LIST, api.getTourGuideList);

/**
 * 메세지 수정
 */
function* putTourGuideList({ payload }) {
    const { tourGuideList, callback } = payload;
    const ACTION = act.PUT_TOUR_GUIDE_LIST;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putTourGuideList, tourGuideList);
        callbackData = response.data;

        if (response.data.header.success) {
            // 메세지 리스트 조회
            yield put({ type: act.GET_TOUR_GUIDE_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}
export default function* saga() {
    yield takeLatest(act.GET_TOUR_GUIDE_LIST, getTourGuideList);
    yield takeLatest(act.PUT_TOUR_GUIDE_LIST, putTourGuideList);
}
