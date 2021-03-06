import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './scheduleAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    runState: {
        statisticList: [],
        runStateList: [],
        statisticTotal: 0,
        runStateTotal: 0,
        error: null,
        search: {
            sort: 'jobSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'keyword0',
            keyword: '',
            useTotal: '',
            category: '',
            period: '',
            sendType: '',
            serverSeq: '',
            genResult: '',
        },
    },
    work: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: 'jobSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'keyword0',
            keyword: '',
            useTotal: '',
            category: '',
            period: '',
            sendType: '',
            serverSeq: '',
            usedYn: '',
        },
        deployServerCode: null,
        job: {
            jobSeq: '',
            usedYn: 'Y',
            delYn: '',
            category: 'E1',
            pkgNm: '',
            jobType: 'S',
            jobCd: '',
            jobNm: '',
            serverSeq: '',
            period: 300,
            sendType: '',
            ftpPort: '',
            ftpPassive: 'Y',
            targetPath: '',
            targetFileName: '',
            jobDesc: '',
            pkgOpt: '',
            callUrl: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            jobStatus: {},
            regMember: {},
            modMember: {},
        },
    },
    deleteWork: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: 'jobSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'keyword0',
            keyword: '',
            useTotal: '',
            category: '',
            period: '',
            sendType: '',
            serverSeq: '',
        },
        deleteJob: {},
    },
    deployServer: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: 'serverSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            useTotal: '',
            serverNm: '',
            serverIp: '',
        },
        server: {
            serverSeq: '',
            serverNm: '',
            serverIp: '',
            accessId: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            regMember: {
                memberId: '',
                memberNm: '',
            },
            modMember: {
                memberId: '',
                memberNm: '',
            },
        },
    },
    backOffice: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: 'seqNo,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            useTotal: '',
            startDay: null,
            endDay: null,
            jobSeq: '',
            status: '',
            jobCd: '',
        },
        jobCode: [],
        backOfficeJob: {
            seqNo: null,
            jobSeq: null,
            status: '',
            delYn: '',
            reserveDt: '',
            startDt: '',
            endDt: '',
            jobTaskId: null,
            paramDesc: '',
            jobContent: {},
        },
    },
};

/**
 * reducer
 */
export default handleActions(
    {
        // ???????????? ??????
        [act.CHANGE_RUN_STATE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.runState.search = payload;
            });
        },
        [act.CHANGE_WORK_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.work.search = payload;
            });
        },
        [act.CHANGE_DELETE_WORK_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.deleteWork.search = payload;
            });
        },
        [act.CHANGE_DEPLOY_SERVER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.deployServer.search = payload;
            });
        },
        [act.CHANGE_BACK_OFFICE_WORK_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.backOffice.search = payload;
            });
        },
        // ????????? ????????? ?????????
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_JOB]: (state) => {
            return produce(state, (draft) => {
                draft.work.job = initialState.work.job;
            });
        },
        [act.CLEAR_SERVER]: (state) => {
            return produce(state, (draft) => {
                draft.deployServer.server = initialState.deployServer.server;
            });
        },
        [act.CLEAR_DELETE_JOB]: (state) => {
            return produce(state, (draft) => {
                draft.deleteWork.deleteJob = initialState.deleteWork.deleteJob;
            });
        },
        [act.CLEAR_HISTORY_JOB]: (state) => {
            return produce(state, (draft) => {
                draft.backOffice.backOfficeJob = initialState.backOffice.backOfficeJob;
            });
        },
        // ?????? ?????? ?????? ?????? ??????
        [act.GET_JOB_STATISTIC_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.runState.statisticList = body.list;
                draft.runState.statisticTotal = body.totalCnt;
                draft.runState.error = initialState.runState.error;
            });
        },
        [act.GET_JOB_STATISTIC_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.runState.statisticList = initialState.runState.statisticList;
                draft.runState.statisticTotal = initialState.runState.statisticTotal;
                draft.runState.error = payload;
            });
        },
        // ?????? ?????? ?????? ?????? ??????
        [act.GET_JOB_STATISTIC_SEARCH_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.runState.runStateList = body.list;
                draft.runState.runStateTotal = body.totalCnt;
                draft.runState.error = initialState.runState.error;
            });
        },
        [act.GET_JOB_STATISTIC_SEARCH_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.runState.runStateList = initialState.runState.runStateList;
                draft.runState.runStateTotal = initialState.runState.runStateTotal;
                draft.runState.error = payload;
            });
        },
        // ?????? ?????? ??????
        [act.GET_JOB_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.work.list = body.list;
                draft.work.total = body.totalCnt;
                draft.work.error = initialState.work.error;
            });
        },
        [act.GET_JOB_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.work.list = initialState.work.list;
                draft.work.total = initialState.work.total;
                draft.work.error = payload;
            });
        },
        // ?????? ?????? ?????? ?????? (?????? ?????? ??????)
        [act.GET_DISTRIBUTE_SERVER_CODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.work.deployServerCode = body.list;
            });
        },
        [act.GET_DISTRIBUTE_SERVER_CODE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.work.deployServerCode = initialState.work.deployServerCode;
            });
        },
        // ?????? ?????? ??????
        [act.GET_JOB_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.work.job = body;
            });
        },
        [act.GET_JOB_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.work.job = initialState.work.job;
            });
        },
        // ?????? ?????? ?????? ??????
        [act.GET_DELETE_JOB_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deleteWork.list = body.list;
                draft.deleteWork.total = body.totalCnt;
                draft.deleteWork.error = initialState.deleteWork.error;
            });
        },
        [act.GET_DELETE_JOB_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.deleteWork.list = initialState.deleteWork.list;
                draft.deleteWork.total = initialState.deleteWork.total;
                draft.deleteWork.error = payload;
            });
        },
        // ?????? ?????? ?????? ??????
        [act.GET_DELETE_JOB_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deleteWork.deleteJob = body;
            });
        },
        [act.GET_DELETE_JOB_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.deleteWork.deleteJob = initialState.deleteWork.deleteJob;
            });
        },
        // ?????? ?????? ?????? ??????
        [act.GET_DISTRIBUTE_SERVER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deployServer.list = body.list;
                draft.deployServer.total = body.totalCnt;
                draft.deployServer.error = initialState.deployServer.error;
            });
        },
        [act.GET_DISTRIBUTE_SERVER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.deployServer.list = initialState.deployServer.list;
                draft.deployServer.total = initialState.deployServer.total;
                draft.deployServer.error = payload;
            });
        },
        // ?????? ?????? ?????? ??????
        [act.GET_DISTRIBUTE_SERVER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deployServer.server = body;
            });
        },
        [act.GET_DISTRIBUTE_SERVER_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.deployServer.server = initialState.deployServer.server;
            });
        },
        // ???????????? ?????? ??????
        [act.GET_JOB_CODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.backOffice.jobCode = body.list;
            });
        },
        // ???????????? ????????????
        [act.GET_JOB_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.backOffice.list = body.list;
                draft.backOffice.total = body.totalCnt;
                draft.backOffice.error = initialState.backOffice.error;
            });
        },
        [act.GET_JOB_HISTORY_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.backOffice.list = initialState.backOffice.list;
                draft.backOffice.total = initialState.backOffice.total;
                draft.backOffice.error = payload;
            });
        },
        // ???????????? ????????????
        [act.GET_HISTORY_JOB_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.backOffice.backOfficeJob = body;
            });
        },
    },
    initialState,
);
