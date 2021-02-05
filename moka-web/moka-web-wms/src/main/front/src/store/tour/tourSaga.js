import { call, put, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './tourApi';
import * as act from './tourAction';

/**
 * 견학 메세지 목록 조회
 */
const getTourGuideList = createRequestSaga(act.GET_TOUR_GUIDE_LIST, api.getTourGuideList);

/**
 * 견학 메세지 수정
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
 * 견학 휴일 목록 조회(매년반복)
 */
const getTourDenyList = createRequestSaga(act.GET_TOUR_DENY_LIST, api.getTourDenyList);

/**
 * 견학 휴일 등록, 수정
 */
function* saveTourDeny({ payload }) {
    const { tourDeny, callback, search } = payload;
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
            if (search) {
                yield put({
                    type: act.GET_TOUR_DENY_MONTH_LIST,
                    payload: search,
                });
            } else {
                yield put({
                    type: act.GET_TOUR_DENY_LIST,
                });
            }
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
 * 견학 휴일 삭제
 */
function* deleteTourDeny({ payload }) {
    const { denySeq, callback, search } = payload;
    const ACTION = act.DELETE_TOUR_DENY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.deleteTourDeny, { denySeq });
        callbackData = response.data;

        if (response.data.header.success) {
            // 휴일 목록 검색
            if (search) {
                yield put({
                    type: act.GET_TOUR_DENY_MONTH_LIST,
                    payload: search,
                });
            } else {
                yield put({ type: act.GET_TOUR_DENY_LIST });
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
 * 견학 기본 설정 조회
 */
const getTourSetup = createRequestSaga(act.GET_TOUR_SETUP, api.getTourSetup);

/**
 * 견학 기본 설정 수정
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

/**
 * 견학 신청 목록 조회
 */
const getTourApplyList = callApiAfterActions(act.GET_TOUR_APPLY_LIST, api.getTourApplyList, (store) => store.tour);

/**
 * 견학 신청 상세 조회
 */
const getTourApply = createRequestSaga(act.GET_TOUR_APPLY, api.getTourApply);

/**
 * 견학 신청 수정
 */
function* putTourApply({ payload }) {
    const { tourApply, callback } = payload;
    const ACTION = act.PUT_TOUR_APPLY;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.putTourApply, { tourApply });
        callbackData = response.data;

        if (response.data.header.success) {
            // 신청 목록 다시 조회
            yield put({ type: act.GET_TOUR_APPLY_LIST });
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
 * 견학 신청 삭제
 */
function* deleteTourApply({ payload }) {
    const { tourSeq, callback } = payload;
    const ACTION = act.DELETE_TOUR_APPLY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.deleteTourApply, { tourSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            // 신청 목록 조회
            yield put({ type: act.GET_TOUR_APPLY_LIST });
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
 * 견학 가능일 목록 조회
 */
const getTourDenyPossibleList = createRequestSaga(act.GET_TOUR_DENY_POSSIBLE_LIST, api.getTourDenyPossibleList);

/**
 * 견학 비밀번호 초기화
 */
const postResetPwd = createRequestSaga(act.POST_RESET_PWD, api.postResetPwd, true);

/**
 * 견학 휴일 목록 조회 (월별)
 */
const getTourDenyMonthList = createRequestSaga(act.GET_TOUR_DENY_MONTH_LIST, api.getTourDenyMonthList);

/**
 * 견학 신청 목록 조회 (월별)
 */
const getTourApplyMonthList = createRequestSaga(act.GET_TOUR_APPLY_MONTH_LIST, api.getTourApplyMonthList);

export default function* saga() {
    yield takeLatest(act.GET_TOUR_GUIDE_LIST, getTourGuideList);
    yield takeLatest(act.PUT_TOUR_GUIDE_LIST, putTourGuideList);
    yield takeLatest(act.GET_TOUR_DENY_LIST, getTourDenyList);
    yield takeLatest(act.SAVE_TOUR_DENY, saveTourDeny);
    yield takeLatest(act.DELETE_TOUR_DENY, deleteTourDeny);
    yield takeLatest(act.GET_TOUR_SETUP, getTourSetup);
    yield takeLatest(act.PUT_TOUR_SETUP, putTourSetup);
    yield takeLatest(act.GET_TOUR_APPLY_LIST, getTourApplyList);
    yield takeLatest(act.GET_TOUR_APPLY, getTourApply);
    yield takeLatest(act.PUT_TOUR_APPLY, putTourApply);
    yield takeLatest(act.DELETE_TOUR_APPLY, deleteTourApply);
    yield takeLatest(act.GET_TOUR_DENY_POSSIBLE_LIST, getTourDenyPossibleList);
    yield takeLatest(act.POST_RESET_PWD, postResetPwd);
    yield takeLatest(act.GET_TOUR_DENY_MONTH_LIST, getTourDenyMonthList);
    yield takeLatest(act.GET_TOUR_APPLY_MONTH_LIST, getTourApplyMonthList);
}
