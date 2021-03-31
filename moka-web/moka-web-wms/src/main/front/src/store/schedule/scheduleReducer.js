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
            searchType: '',
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
            searchType: '',
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
            jobDesc: '',
            pkgOpt: '',
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
            searchType: '',
            keyword: '',
            useTotal: '',
            category: '',
            period: '',
            sendType: '',
            serverSeq: '',
        },
        deleteJob: {
            seqNo: '',
            jobSeq: '',
            serverSeq: '',
            category: '',
            period: '',
            sendType: '',
            ftpPort: '',
            ftpPassive: '',
            targetPath: '',
            jobDesc: '',
            regDt: '',
            regId: '',
            jobStatus: '',
            regMember: {
                memberId: '',
                memberNm: '',
            },
        },
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
        // 검색조건 변경
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
        // 스토어 데이터 초기화
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_RUN_STATE_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.runState.search = initialState.runState.search;
            });
        },
        [act.CLEAR_WORK_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.work.search = initialState.work.search;
            });
        },
        [act.CLEAR_DELETE_WORK_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.deleteWork.search = initialState.deleteWork.search;
            });
        },
        [act.CLEAR_DEPLOY_SERVER_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.deployServer.search = initialState.deployServer.search;
            });
        },
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
        [act.CLEAR_HISTORY_JOB]: (state) => {
            return produce(state, (draft) => {
                draft.backOffice.backOfficeJob = initialState.backOffice.backOfficeJob;
            });
        },
        // 작업 실행 통계 목록 조회
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
        // 작업 실행 현황 목록 조회
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
        // 작업 목록 조회
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
        // 배포 서버 목록 조회 (검색 조건 코드)
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
        // 작업 상세 조회
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
        // 삭제 작업 목록 조회
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
        // 삭제 작업 상세 조회
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
        // 배포 서버 목록 조회
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
        // 배포 서버 상세 조회
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
        // 작업코드 목록 조회
        [act.GET_JOB_CODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.backOffice.jobCode = body.list;
            });
        },
        // 작업예약 목록조회
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
        // 작업예약 상세조회
        [act.GET_HISTORY_JOB_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.backOffice.backOfficeJob = body;
            });
        },
    },
    initialState,
);
