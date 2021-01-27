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

/**
 * 휴일 목록조회(매년반복)
 */
const getTourDenyList = createRequestSaga(act.GET_TOUR_DENY_LIST, api.getTourDenyList);

/**
 * 휴일 등록, 수정
 */
function* saveTourDeny({ payload }) {
    const { tourDeny, callback } = payload;
    const ACTION = act.SAVE_TOUR_DENY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        // 등록/수정 분기
        if (tourDeny.denySeq) {
            response = yield call(api.putTourDeny, tourDeny);
        } else {
            response = yield call(api.postTourDeny, tourDeny);
        }
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            yield put({
                type: act.GET_TOUR_DENY_LIST,
            });
        } else {
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: response.data.body.list,
                });
            }
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
 * 휴일 삭제
 */
function* deleteTourDeny({ payload }) {
    const { denySeq, callback } = payload;
    const ACTION = act.DELETE_TOUR_DENY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.deleteTourDeny, { denySeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            // 휴일 목록 검색
            yield put({ type: act.GET_TOUR_DENY_LIST });
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
 * 견학기본설정 조회
 */
const getTourSetup = createRequestSaga(act.GET_TOUR_SETUP, api.getTourSetup);

/**
 * 견학기본설정 수정
 */
function* putTourSetup({ payload }) {
    const { tourSetup, callback } = payload;
    const ACTION = act.PUT_TOUR_GUIDE_LIST;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putTourSetup, tourSetup);
        callbackData = response.data;

        if (response.data.header.success) {
            // 기본 설정 조회
            yield put({ type: act.GET_TOUR_SETUP });
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
    yield takeLatest(act.GET_TOUR_DENY_LIST, getTourDenyList);
    yield takeLatest(act.SAVE_TOUR_DENY, saveTourDeny);
    yield takeLatest(act.DELETE_TOUR_DENY, deleteTourDeny);
    yield takeLatest(act.GET_TOUR_SETUP, getTourSetup);
    yield takeLatest(act.PUT_TOUR_SETUP, putTourSetup);
}
