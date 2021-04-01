import {
    // call, put,
    takeLatest,
} from 'redux-saga/effects';
// import moment from 'moment';
// import { DB_DATEFORMAT } from '@/constants';
// import { finishLoading, startLoading } from '@store/loading';
import {
    // errorResponse,
    createRequestSaga,
} from '@store/commons/saga';
import * as api from '@store/issue/issueApi';
import * as act from '@store/issue/issueAction';

/**
 * 이슈 목록 조회
 */
const getIssueList = createRequestSaga(act.GET_ISSUE_LIST, api.getIssueList);

/**
 * 이슈 목록 조회 (모달)
 */
const getIssueListModal = createRequestSaga(act.GET_ISSUE_LIST_MODAL, api.getIssueList, true);

/**
 * saga
 */
export default function* saga() {
    yield takeLatest(act.GET_ISSUE_LIST, getIssueList);
    yield takeLatest(act.GET_ISSUE_LIST_MODAL, getIssueListModal);
}
