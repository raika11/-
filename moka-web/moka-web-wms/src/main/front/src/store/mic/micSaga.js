import { takeLatest, put, call, select } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './micApi';
import * as act from './micAction';

/**
 * 아젠다 목록 조회
 */
const getMicAgendaList = createRequestSaga(act.GET_MIC_AGENDA_LIST, api.getMicAgendaList);

/**
 * 아젠다 목록 조회(모달)
 */
const getMicAgendaListModal = createRequestSaga(act.GET_MIC_AGENDA_LIST_MODAL, api.getMicAgendaList, true);

/**
 * 아젠다 상세 조회
 */
const getMicAgenda = createRequestSaga(act.GET_MIC_AGENDA, api.getMicAgenda);

/**
 * 아젠다 순서 변경
 */
const putMicAgendaSort = createRequestSaga(act.PUT_MIC_AGENDA_SORT, api.putMicAgendaSort, true);

/**
 * 카테고리 목록 조회
 */
const getMicCategoryList = createRequestSaga(act.GET_MIC_CATEGORY_LIST, api.getMicCategoryList);

/**
 * 카테고리 등록/수정
 */
function* saveMicCategory({ payload }) {
    const { category, categoryList, callback } = payload;
    const ACTION = act.SAVE_MIC_CATEGORY;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        if (category) {
            // 등록
            response = yield call(api.postMicCategory, { category });
        } else {
            // 수정
            response = yield call(api.putMicCategory, { categoryList });
        }
        callbackData = response.data;
        if (response.data.header.success) {
            // 목록 조회
            const search = yield select(({ mic }) => mic.category.search);
            yield put({
                type: act.GET_MIC_CATEGORY_LIST,
                payload: { search },
            });
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
 * 아젠다, 전체 포스트 수
 */
const getMicReport = createRequestSaga(act.GET_MIC_REPORT, api.getMicReport);

/**
 * 배너 목록 (모달)
 */
const getMicBannerListModal = createRequestSaga(act.GET_MIC_BANNER_LIST_MODAL, api.getMicBannerList, true);

/**
 * 배너 등록/수정
 */
function* saveBanner({ payload }) {
    const { banner, callback } = payload;
    const ACTION = act.SAVE_MIC_BANNER;
    let response, callbackData;

    yield put(startLoading(ACTION));
    try {
        response = yield call(banner.bnnrSeq ? api.putMicBanner : api.postMicBanner, { banner });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 배너 사용여부 변경
 */
const putMicBannerToggle = createRequestSaga(act.PUT_MIC_BANNER_TOGGLE, api.putMicBannerToggle, true);

export default function* saga() {
    yield takeLatest(act.GET_MIC_AGENDA_LIST, getMicAgendaList);
    yield takeLatest(act.GET_MIC_REPORT, getMicReport);
    yield takeLatest(act.GET_MIC_AGENDA_LIST_MODAL, getMicAgendaListModal);
    yield takeLatest(act.PUT_MIC_AGENDA_SORT, putMicAgendaSort);
    yield takeLatest(act.GET_MIC_CATEGORY_LIST, getMicCategoryList);
    yield takeLatest(act.SAVE_MIC_CATEGORY, saveMicCategory);
    yield takeLatest(act.GET_MIC_BANNER_LIST_MODAL, getMicBannerListModal);
    yield takeLatest(act.SAVE_MIC_BANNER, saveBanner);
    yield takeLatest(act.PUT_MIC_BANNER_TOGGLE, putMicBannerToggle);
    yield takeLatest(act.GET_MIC_AGENDA, getMicAgenda);
}
