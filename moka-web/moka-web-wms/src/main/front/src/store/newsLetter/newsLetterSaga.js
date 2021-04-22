import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '@store/commons/saga';
import * as act from './newsLetterAction';
import * as api from './newsLetterApi';

// 뉴스레터 상품 목록 조회
const getNewsLetterList = callApiAfterActions(act.GET_NEWS_LETTER_LIST, api.getNewsLetterList, (state) => state.newsLetter.newsLetter);

// 뉴스레터 상품 상세 조회
const getNewsLetter = createRequestSaga(act.GET_NEWS_LETTER, api.getNewsLetter);

export default function* newsLetterSaga() {
    yield takeLatest(act.GET_NEWS_LETTER_LIST, getNewsLetterList);
    yield takeLatest(act.GET_NEWS_LETTER, getNewsLetter);
}
