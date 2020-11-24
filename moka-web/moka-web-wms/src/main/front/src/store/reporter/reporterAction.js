import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'reporter/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'reporter/CLEAR_REPORTER_ALL';
export const CLEAR_REPORTER = 'reporter/CLEAR_REPORTER';
export const CLEAR_LIST = 'reporter/CLEAR_LIST';
export const CLEAR_SEARCH = 'reporter/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearReporter = createAction(CLEAR_REPORTER);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_REPORTER_LIST, GET_REPORTER_LIST_SUCCESS, GET_REPORTER_LIST_FAILURE] = createRequestActionTypes('reporter/GET_REPORTER_LIST');
export const [GET_REPORTER, GET_REPORTER_SUCCESS, GET_REPORTER_FAILURE] = createRequestActionTypes('reporter/GET_REPORTER');
export const getReporterList = createAction(GET_REPORTER_LIST, (...actions) => actions);
export const getReporter = createAction(GET_REPORTER, (reporter) => reporter);

/**
 * 모달 데이터 조회
 */
export const GET_REPORTER_LIST_MODAL = 'reporter/GET_REPORTER_LIST_MODAL';
export const getReporterListModal = createAction(GET_REPORTER_LIST_MODAL, ({ search, callback, type }) => ({ search, callback, type }));

/**
 * 데이터 변경
 */
export const CHANGE_REPORTER = 'reporter/CHANGE_REPORTER';
// export const CHANGE_INVALID_LIST = 'reporter/CHANGE_INVALID_LIST';
export const changeReporter = createAction(CHANGE_REPORTER, (reporter) => reporter);
// export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_REPORTER = 'reporter/SAVE_REPORTER';
export const saveReporter = createAction(SAVE_REPORTER, ({ type, actions, callback }) => ({ type, actions, callback }));
