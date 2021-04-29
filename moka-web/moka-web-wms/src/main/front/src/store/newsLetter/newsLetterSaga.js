import { takeLatest, put, call, select } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as act from './newsLetterAction';
import * as api from './newsLetterApi';

/**
 * 뉴스레터 상품 목록 조회
 */
const getNewsLetterList = callApiAfterActions(act.GET_NEWS_LETTER_LIST, api.getNewsLetterList, (state) => state.newsLetter.newsLetter);

/**
 * 뉴스레터 상품 상세 조회
 */
const getNewsLetter = createRequestSaga(act.GET_NEWS_LETTER, api.getNewsLetter);

/**
 * 뉴스레터 발송 목록 조회
 */
const getNewsLetterSendList = callApiAfterActions(act.GET_NEWS_LETTER_SEND_LIST, api.getNewsLetterSendList, (state) => state.newsLetter.send);

/**
 * 뉴스레터 채널별 등록된 컨텐츠 조회 후 발송 콘텐츠 목록 조회
 * (ISSUE, TOPIC, SERIES, ARTICLE, REPORTER, JPOD)
 */
// function* getNewsLetterChannelTypeList({ payload: { channelType, callback }}) {
//     const ACTION = act.GET_NEWS_LETTER_PASSIVE_LIST;
//     let response,
//         callbackData = {};

//     yield put(startLoading(ACTION));
//     try {
//         const search = yield select(({ newsLetter }) => newsLetter.newsLetter.search);
//         const ns = { ...search, sendType: 'E', status: 'Y' };
//         const response = yield call(api.getNewsLetterList, { search: ns });
//         callbackData = response.data;

//         if (response.data.header.success) {
//             yield put({
//                 type: act.GET_NEWS_LETTER_CHANNEL_TYPE_SUCCESS,
//                 payload: response.data,
//             });
//         } else {
//             yield put({
//                 type: act.GET_NEWS_LETTER_CHANNEL_TYPE_FAILURE,
//                 payload: response.data,
//             });
//         }
//     } catch (e) {
//         callbackData = errorResponse(e);
//     }

//     if (typeof callback === 'function') {
//         yield call(callback, callbackData);
//     }

//     yield put(finishLoading(ACTION));
// }
const getNewsLetterChannelTypeList = createRequestSaga(act.GET_NEWS_LETTER_CHANNEL_TYPE, api.getNewsLetterChannelType);

/**
 * 수동 뉴스레터 목록 조회
 */
function* getNewsLetterPassiveList() {
    const ACTION = act.GET_NEWS_LETTER_PASSIVE_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const search = yield select(({ newsLetter }) => newsLetter.newsLetter.search);
        const ns = { ...search, sendType: 'E', status: 'Y' };
        const response = yield call(api.getNewsLetterList, { search: ns });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_NEWS_LETTER_PASSIVE_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: act.GET_NEWS_LETTER_PASSIVE_LIST_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_NEWS_LETTER_PASSIVE_LIST_FAILURE,
            payload: callbackData,
        });
    }

    yield put(finishLoading(ACTION));
}

export default function* newsLetterSaga() {
    yield takeLatest(act.GET_NEWS_LETTER_LIST, getNewsLetterList);
    yield takeLatest(act.GET_NEWS_LETTER, getNewsLetter);
    yield takeLatest(act.GET_NEWS_LETTER_CHANNEL_TYPE, getNewsLetterChannelTypeList);
    yield takeLatest(act.GET_NEWS_LETTER_SEND_LIST, getNewsLetterSendList);
    yield takeLatest(act.GET_NEWS_LETTER_PASSIVE_LIST, getNewsLetterPassiveList);
}
