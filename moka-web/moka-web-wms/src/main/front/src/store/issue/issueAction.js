import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

/**
 * 스토어 데이터 변경
 */
export const CLEAR_STORE = 'issue/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_ISSUE = 'issue/CLEAR_ISSUE';
export const clearIssue = createAction(CLEAR_ISSUE);

/**
 * 이슈 목록 조회
 */
export const [GET_ISSUE_LIST, GET_ISSUE_LIST_SUCCESS, GET_ISSUE_LIST_FAILURE] = createRequestActionTypes('issue/GET_ISSUE_LIST');
export const getIssueList = createAction(GET_ISSUE_LIST, ({ search, callback }) => ({ search, callback }));
export const GET_ISSUE_LIST_MODAL = 'issue/GET_ISSUE_LIST_MODAL';
export const getIssueListModal = createAction(GET_ISSUE_LIST_MODAL, ({ search, callback }) => ({ search, callback }));
export const [GET_ISSUE_LIST_GROUP_BY_ORDNO] = createRequestActionTypes('issue/GET_ISSUE_LIST_GROUP_BY_ORDNO');
export const getIssueListGroupByOrdno = createAction(GET_ISSUE_LIST_GROUP_BY_ORDNO, ({ search, callback }) => ({ search, callback }));

/**
 * 이슈 조회
 */
export const [GET_ISSUE, GET_ISSUE_SUCCESS, GET_ISSUE_FAILURE] = createRequestActionTypes('issue/GET_ISSUE');
export const getIssue = createAction(GET_ISSUE, ({ pkgSeq, callback }) => ({ pkgSeq, callback }));
export const [GET_ISSUE_GROUP_BY_ORDNO] = createRequestActionTypes('issue/GET_ISSUE_GROUP_BY_ORDNO');
export const getIssueGroupByOrdno = createAction(GET_ISSUE_GROUP_BY_ORDNO, ({ pkgSeq, callback }) => ({ pkgSeq, callback }));

/**
 * 이슈 저장
 */
export const SAVE_ISSUE = 'issue/SAVE_ISSUE';
export const saveIssue = createAction(SAVE_ISSUE, ({ pkg, callback }) => ({ pkg, callback }));

/**
 * 이슈 종료
 */
export const FINISH_ISSUE = 'issue/FINISH_ISSUE';
export const finishIssue = createAction(FINISH_ISSUE, ({ pkgSeq, callback }) => ({ pkgSeq, callback }));
