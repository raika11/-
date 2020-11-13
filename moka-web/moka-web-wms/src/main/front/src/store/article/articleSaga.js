import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as act from './articleAction';
import * as api from './articleApi';

/**
 * 기사 목록 조회
 */
const getArticleList = callApiAfterActions(act.getArticleList, api.getArticleList, (store) => store.article);

export default function* saga() {
    yield takeLatest(act.GET_ARTICLE_LIST, getArticleList);
}
