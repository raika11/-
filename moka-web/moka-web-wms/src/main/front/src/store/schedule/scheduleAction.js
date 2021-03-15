import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_RUN_STATE_SEARCH_OPTION = 'schedule/CHANGE_RUN_STATE_SEARCH_OPTION';
export const changeRunStateSearchOption = createAction(CHANGE_RUN_STATE_SEARCH_OPTION, (search) => search);
export const CHANGE_WORK_SEARCH_OPTION = 'schedule/CHANGE_WORK_SEARCH_OPTION';
export const changeWorkSearchOption = createAction(CHANGE_WORK_SEARCH_OPTION, (search) => search);
export const CHANGE_DELETE_WORK_SEARCH_OPTION = 'schedule/CHANGE_DELETE_WORK_SEARCH_OPTION';
export const changeDeleteWorkSearchOption = createAction(CHANGE_DELETE_WORK_SEARCH_OPTION, (search) => search);
export const CHANGE_DEPLOY_SERVER_SEARCH_OPTION = 'schedule/CHANGE_DEPLOY_SERVER_SEARCH_OPTION';
export const changeDeployServerSearchOption = createAction(CHANGE_DEPLOY_SERVER_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_STORE = 'schedule/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE, (payload) => payload);
export const CLEAR_RUN_STATE_SEARCH = 'schedule/CLEAR_RUN_STATE_SEARCH';
export const clearRunStateSearch = createAction(CLEAR_RUN_STATE_SEARCH, (payload) => payload);
export const CLEAR_WORK_SEARCH = 'schedule/CLEAR_WORK_SEARCH';
export const clearWorkSearch = createAction(CLEAR_WORK_SEARCH, (payload) => payload);
export const CLEAR_DELETE_WORK_SEARCH = 'schedule/CLEAR_WORK_SEARCH';
export const clearDeleteWorkSearch = createAction(CLEAR_WORK_SEARCH, (payload) => payload);
export const CLEAR_DEPLOY_SERVER_SEARCH = 'schedule/CLEAR_DEPLOY_SERVER_SEARCH';
export const clearDeployServerSearch = createAction(CLEAR_DEPLOY_SERVER_SEARCH, (payload) => payload);
export const CLEAR_JOB = 'schedule/CLEAR_WORK_JOB';
export const clearJob = createAction(CLEAR_JOB, (payload) => payload);
export const CLEAR_SERVER = 'schedule/CLEAR_SERVER';
export const clearServer = createAction(CLEAR_SERVER, (payload) => payload);

/**
 * 조회 액션
 */
export const [GET_JOB_STATISTIC_LIST, GET_JOB_STATISTIC_LIST_SUCCESS, GET_JOB_STATISTIC_LIST_FAILURE] = createRequestActionTypes('schedule/GET_JOB_STATISTIC_LIST');
export const getJobStatisticList = createAction(GET_JOB_STATISTIC_LIST, (...actions) => actions);
export const [GET_JOB_STATISTIC_SEARCH_LIST, GET_JOB_STATISTIC_SEARCH_LIST_SUCCESS, GET_JOB_STATISTIC_SEARCH_LIST_FAILURE] = createRequestActionTypes(
    'schedule/GET_JOB_STATISTIC_SEARCH_LIST',
);
export const getJobStatisticSearchList = createAction(GET_JOB_STATISTIC_SEARCH_LIST, (...actions) => actions);
export const [GET_JOB_LIST, GET_JOB_LIST_SUCCESS, GET_JOB_LIST_FAILURE] = createRequestActionTypes('schedule/GET_JOB_LIST');
export const getJobList = createAction(GET_JOB_LIST, (...actions) => actions);
export const [GET_DISTRIBUTE_SERVER_CODE, GET_DISTRIBUTE_SERVER_CODE_SUCCESS, GET_DISTRIBUTE_SERVER_CODE_FAILURE] = createRequestActionTypes('schedule/GET_DISTRIBUTE_SERVER_CODE');
export const getDistributeServerCode = createAction(GET_DISTRIBUTE_SERVER_CODE, () => ({}));
export const [GET_JOB, GET_JOB_SUCCESS, GET_JOB_FAILURE] = createRequestActionTypes('schedule/GET_JOB');
export const getJob = createAction(GET_JOB, (jobSeq) => jobSeq);
export const [GET_DELETE_JOB_LIST, GET_DELETE_JOB_LIST_SUCCESS, GET_DELETE_JOB_LIST_FAILURE] = createRequestActionTypes('schedule/GET_DELETE_JOB_LIST');
export const getDeleteJobList = createAction(GET_DELETE_JOB_LIST, (...actions) => actions);
export const [GET_DELETE_JOB, GET_DELETE_JOB_SUCCESS, GET_DELETE_JOB_FAILURE] = createRequestActionTypes('schedule/GET_DELETE_JOB');
export const getDeleteJob = createAction(GET_DELETE_JOB, (jobSeq) => jobSeq);
export const [GET_DISTRIBUTE_SERVER_LIST, GET_DISTRIBUTE_SERVER_LIST_SUCCESS, GET_DISTRIBUTE_SERVER_LIST_FAILURE] = createRequestActionTypes('schedule/GET_DISTRIBUTE_SERVER_LIST');
export const getDistributeServerList = createAction(GET_DISTRIBUTE_SERVER_LIST, (...actions) => actions);
export const [GET_DISTRIBUTE_SERVER, GET_DISTRIBUTE_SERVER_SUCCESS, GET_DISTRIBUTE_SERVER_FAILURE] = createRequestActionTypes('schedule/GET_DISTRIBUTE_SERVER');
export const getDistributeServer = createAction(GET_DISTRIBUTE_SERVER, (serverSeq) => serverSeq);

/**
 * 저장, 등록, 수정 액션
 */
export const SAVE_JOB = 'schedule/POST_JOB';
export const saveJob = createAction(SAVE_JOB, ({ job, jobSeq, callback }) => ({ job, jobSeq, callback }));
export const PUT_RECOVER_JOB = 'schedule/PUT_RECOVER_JOB';
export const putRecoverJob = createAction(PUT_RECOVER_JOB, ({ jobSeq, callback }) => ({ jobSeq, callback }));
export const SAVE_DISTRIBUTE_SERVER = 'schedule/SAVE_DISTRIBUTE_SERVER';
export const saveDistributeServer = createAction(SAVE_DISTRIBUTE_SERVER, ({ server, serverSeq, callback }) => ({ server, serverSeq, callback }));

/**
 * 삭제 액션
 */
export const DELETE_JOB = 'schedule/DELETE_JOB';
export const deleteJob = createAction(DELETE_JOB, ({ jobSeq, callback }) => ({ jobSeq, callback }));
export const DELETE_SERVER = 'schedule/DELETE_SERVER';
export const deleteServer = createAction(DELETE_SERVER, ({ serverSeq, callback }) => ({ serverSeq, callback }));
