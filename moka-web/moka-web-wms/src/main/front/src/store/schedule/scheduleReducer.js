import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './scheduleAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
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
            callUrl: '',
        },
        deployServerCode: null,
        job: {
            jobSeq: '',
            usedYn: 'Y',
            delYn: '',
            category: '',
            pkgNm: '',
            jobType: '',
            jobCd: '',
            serverSeq: '',
            period: 300,
            sendType: '',
            ftpPort: '',
            ftpPassive: '',
            callUrl: '',
            targetPath: '',
            jobDesc: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            jobStatus: {},
            regMember: {},
            modMember: {},
        },
    },
    deployServer: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: '',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            useTotal: '',
            serverNm: '',
            serverIp: '',
        },
    },
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_WORK_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.work.search = payload;
            });
        },
        [act.CHANGE_DEPLOY_SERVER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.deployServer.search = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_WORK_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.work.search = initialState.work.search;
            });
        },
        [act.CLEAR_JOB]: (state) => {
            return produce(state, (draft) => {
                draft.work.job = initialState.work.job;
            });
        },
        /**
         * 작업 목록 조회
         */
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
        /**
         * 배포 서버 목록 조회 (검색 조건 코드)
         */
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
        /**
         * 작업 상세 조회
         */
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
        /**
         * 배포 서버 목록 조회
         */
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
    },
    initialState,
);
