import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'reporterMgr/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'reporterMgr/CLEAR_REPORTER_MGR_ALL';
export const CLEAR_REPORTER_MGR = 'reporterMgr/CLEAR_REPORTER_MGR';
export const CLEAR_LIST = 'reporterMgr/CLEAR_LIST';
export const CLEAR_SEARCH = 'reporterMgr/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearReporterMgr = createAction(CLEAR_REPORTER_MGR);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_REPORTER_MGR_LIST, GET_REPORTER_MGR_LIST_SUCCESS, GET_REPORTER_MGR_LIST_FAILURE] = createRequestActionTypes('reporterMgr/GET_REPORTER_MGR_LIST');
export const [GET_REPORTER_MGR, GET_REPORTER_MGR_SUCCESS, GET_REPORTER_MGR_FAILURE] = createRequestActionTypes('reporterMgr/GET_REPORTER_MGR');
export const getReporterMgrList = createAction(GET_REPORTER_MGR_LIST, (...actions) => {
    return actions;
});

export const getReporterMgr = createAction(GET_REPORTER_MGR, (reporterMgr) => reporterMgr);

/**
 * 중복체크
 */
export const DUPLICATE_REPORTER_MGR_CHECK = 'reporterMgr/DUPLICATE_REPORTER_MGR_CHECK';
export const duplicateReporterMgrCheck = createAction(DUPLICATE_REPORTER_MGR_CHECK, ({ reporterMgr, callback }) => ({ reporterMgr, callback }));

// 중복체크 로직 없음. 해당 내역은 외부연계 데이터 받아올것으로 보임 완료후 해당내역삭제
//export const HAS_RELATION_LIST = 'group/HAS_RELATION_LIST';
//export const hasRelationList = createAction(HAS_RELATION_LIST, ({ groupCd, callback }) => ({ groupCd, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_REPORTER_MGR = 'reporterMgr/CHANGE_REPORTER_MGR';
export const CHANGE_INVALID_LIST = 'reporterMgr/CHANGE_INVALID_LIST';
export const changeReporterMgr = createAction(CHANGE_REPORTER_MGR, (reporterMgr) => reporterMgr);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);
