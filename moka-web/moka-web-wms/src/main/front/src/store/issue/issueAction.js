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
export const [GET_ISSUE_LIST_GROUP_BY_ORDNO] = createRequestActionTypes('issue/GET_ISSUE_LIST_GROUP_BY_ORDNO');
export const getIssueListGroupByOrdno = createAction(GET_ISSUE_LIST_GROUP_BY_ORDNO, ({ search, callback }) => ({ search, callback }));

export const CHANGE_ISSUE_SEARCH_OPTIONS = 'issue/CHANGE_SEARCH_OPTIONS';
export const changeIssueSearchOptions = createAction(CHANGE_ISSUE_SEARCH_OPTIONS);

/**
 * 이슈 목록 조회 (Modal)
 * @desc getServiceCodeList === true이면 서비스코드 목록 조회 => 서비스 코드 검색조건 (모든 코드)에 포함
 */
export const GET_ISSUE_LIST_MODAL = 'issue/GET_ISSUE_LIST_MODAL';
export const getIssueListModal = createAction(GET_ISSUE_LIST_MODAL, ({ search, callback, getServiceCodeList }) => ({ search, callback, getServiceCodeList }));

export const GET_RECOMMEND_ISSUE_MODAL_LIST = 'issue/GET_RECOMMEND_ISSUE_MODAL_LIST';
export const getRecommendIssueModalList = createAction(GET_RECOMMEND_ISSUE_MODAL_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 이슈의 컨텐츠 목록 조회 (Modal)
 * 이슈의 최신 기사 (자동 기사)
 */
export const GET_ISSUE_CONTENTS_LIST_MODAL = 'issue/GET_ISSUE_CONTENTS_LIST_MODAL';
export const getIssueContentsListModal = createAction(GET_ISSUE_CONTENTS_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

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

/**
 * 이슈 타이틀 중복검사
 */
export const EXISTS_ISSUE_TITLE = 'issue/EXISTS_ISSUE_TITLE';
export const existsIssueTitle = createAction(EXISTS_ISSUE_TITLE);

/**
 * 이슈 데스킹 조회
 */
export const [GET_ISSUE_DESKING, GET_ISSUE_DESKING_SUCCESS] = createRequestActionTypes('issue/GET_ISSUE_DESKING');
export const getIssueDesking = createAction(GET_ISSUE_DESKING, ({ pkgSeq, callback }) => ({ pkgSeq, callback }));

/**
 * 이슈 데스킹 임시저장
 */
export const [SAVE_ISSUE_DESKING, SAVE_ISSUE_DESKING_SUCCESS] = createRequestActionTypes('issue/SAVE_ISSUE_DESKING');
export const saveIssueDesking = createAction(SAVE_ISSUE_DESKING, ({ pkgSeq, compNo, issueDesking, callback }) => ({ pkgSeq, compNo, issueDesking, callback }));

/**
 * 이슈 데스킹 전송
 */
export const [PUBLISH_ISSUE_DESKING, PUBLISH_ISSUE_DESKING_SUCCESS] = createRequestActionTypes('issue/PUBLISH_ISSUE_DESKING');
export const publishIssueDesking = createAction(PUBLISH_ISSUE_DESKING, ({ pkgSeq, compNo, callback }) => ({ pkgSeq, compNo, callback }));

/**
 * 이슈 데스킹 히스토리 스토어 클리어
 */
export const CLEAR_ISSUE_DESKING_HISTORY = 'issue/CLEAR_ISSUE_DESKING_HISTORY';
export const clearIssueDeskingHistory = createAction(CLEAR_ISSUE_DESKING_HISTORY);

/**
 * 이슈 데스킹 히스토리 목록 조회
 */
export const [GET_ISSUE_DESKING_HISTORY_LIST, GET_ISSUE_DESKING_HISTORY_LIST_SUCCESS, GET_ISSUE_DESKING_HISTORY_LIST_FAILURE] = createRequestActionTypes(
    'issue/GET_ISSUE_DESKING_HISTORY_LIST',
);
export const getIssueDeskingHistoryList = createAction(GET_ISSUE_DESKING_HISTORY_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 이슈 데스킹 히스토리 상세 조회
 */
export const [GET_ISSUE_DESKING_HISTORY, GET_ISSUE_DESKING_HISTORY_SUCCESS] = createRequestActionTypes('issue/GET_ISSUE_DESKING_HISTORY');
export const getIssueDeskingHistory = createAction(GET_ISSUE_DESKING_HISTORY, ({ pkgSeq, compNo, regDt, status }) => ({ pkgSeq, compNo, regDt, status }));
