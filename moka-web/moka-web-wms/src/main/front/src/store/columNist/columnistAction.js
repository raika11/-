import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'columNist/CLEAR_STORE';
export const CLEAR_COLUMNIST_LIST = 'columNist/CLEAR_COLUMNIST_LIST';
export const CLEAR_REPORTER_LIST = 'columNist/CLEAR_REPORTER_LIST';
export const clearStore = createAction(CLEAR_STORE);
export const clearColumnist = createAction(CLEAR_COLUMNIST_LIST);
export const clearRepoterlist = createAction(CLEAR_REPORTER_LIST);

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'columNist/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const CLEAR_SEARCH_OPTION = 'columNist/CLEAR_SEARCH_OPTION';
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION, (search) => search);

/**
 * 모달 기사 검색 조건.
 */
export const CHANGE_REPOTER_SEARCH_OPTION = 'columNist/CHANGE_REPOTER_SEARCH_OPTION';
export const changeRepoterSearchOption = createAction(CHANGE_REPOTER_SEARCH_OPTION, (search) => search);

/**
 * 데이터 조회
 */
export const [GET_COLUMNIST_LIST, GET_COLUMNIST_LIST_SUCCESS, GET_COLUMNIST_LIST_FAILURE] = createRequestActionTypes('columNist/GET_COLUMNIST_LIST');
export const [GET_COLUMNIST, GET_COLUMNIST_SUCCESS, GET_COLUMNIST_FAILURE] = createRequestActionTypes('columNist/GET_COLUMNIST');
export const getColumnistList = createAction(GET_COLUMNIST_LIST, (...actions) => actions);
export const getColumnist = createAction(GET_COLUMNIST, ({ seqNo, callback }) => ({ seqNo, callback }));

/**
 * 모달 검색 액션
 */
export const [GET_REPOTER_LIST, GET_REPOTER_LIST_SUCCESS, GET_REPOTER_LIST_FAILURE] = createRequestActionTypes('columNist/GET_REPOTER_LIST');
export const getRepoterList = createAction(GET_REPOTER_LIST, (...actions) => actions);

// 벨리데이션
export const CHANGE_INVALID_LINK = 'columnNist/CHANGE_INVALID_LINK';
export const changeInvalidList = createAction(CHANGE_INVALID_LINK, (invalidList) => invalidList);

// 컬럼니스트 저장.
export const SAVE_COLUMNIST = 'columnNist/SAVE_COLUMNIST';
export const saveColumnist = createAction(SAVE_COLUMNIST, ({ type, actions, callback }) => ({ type, actions, callback }));

// 스토어 컬럼니스트 정보 변경.
export const CHANGE_COLUMNIST = 'directLink/CHANGE_COLUMNIST';
export const changeColumnist = createAction(CHANGE_COLUMNIST, (columist) => columist);

// 삭제
export const [DELETE_COLUMNIST, DELETE_COLUMNIST_SUCCESS, DELETE_COLUMNIST_FAILURE] = createRequestActionTypes('directLink/DELETE_DIRECT_LINK');
export const deleteColumnist = createAction(DELETE_COLUMNIST, ({ seqNo, callback }) => ({ seqNo, callback }));
