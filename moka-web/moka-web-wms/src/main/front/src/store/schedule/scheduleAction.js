import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_WORK_SEARCH_OPTION = 'schedule/CHANGE_WORK_SEARCH_OPTION';
export const changeWorkSearchOption = createAction(CHANGE_WORK_SEARCH_OPTION, (search) => search);
export const CHANGE_DEPLOY_SERVER_SEARCH_OPTION = 'schedule/CHANGE_DEPLOY_SERVER_SEARCH_OPTION';
export const changeDeployServerSearchOption = createAction(CHANGE_DEPLOY_SERVER_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_STORE = 'schedule/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE, (payload) => payload);
export const CLEAR_WORK_SEARCH = 'schedule/CLEAR_WORK_SEARCH';
export const clearWorkSearch = createAction(CLEAR_WORK_SEARCH, (payload) => payload);
export const CLEAR_JOB = 'schedule/CLEAR_WORK_JOB';
export const clearJob = createAction(CLEAR_JOB, (payload) => payload);

/**
 * 조회 액션
 */
export const [GET_JOB_LIST, GET_JOB_LIST_SUCCESS, GET_JOB_LIST_FAILURE] = createRequestActionTypes('schedule/GET_JOB_LIST');
export const getJobList = createAction(GET_JOB_LIST, (...actions) => actions);
export const [GET_DISTRIBUTE_SERVER_CODE, GET_DISTRIBUTE_SERVER_CODE_SUCCESS, GET_DISTRIBUTE_SERVER_CODE_FAILURE] = createRequestActionTypes('schedule/GET_DISTRIBUTE_SERVER_CODE');
export const getDistributeServerCode = createAction(GET_DISTRIBUTE_SERVER_CODE, () => ({}));
export const [GET_JOB, GET_JOB_SUCCESS, GET_JOB_FAILURE] = createRequestActionTypes('schedule/GET_JOB');
export const getJob = createAction(GET_JOB, (jobSeq) => jobSeq);
export const [GET_DISTRIBUTE_SERVER_LIST, GET_DISTRIBUTE_SERVER_LIST_SUCCESS, GET_DISTRIBUTE_SERVER_LIST_FAILURE] = createRequestActionTypes('schedule/GET_DISTRIBUTE_SERVER_LIST');
export const getDistributeServerList = createAction(GET_DISTRIBUTE_SERVER_LIST, (...actions) => actions);

/**
 * 등록 액션
 */
