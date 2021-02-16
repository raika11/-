import { handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import * as act from './bulkMonitorAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const bmInitialState = {
    total: 0,
    sendTotal: 0,
    error: null,
    totalList: [],
    sendList: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        searchType: 'all',
        keyword: '',
        useTotal: '',
        orgSourceCode: 'all',
        portalDiv: null,
        status: 'Y',
        startDt: moment().format('YYYY-MM-DD'),
        endDt: moment().format('YYYY-MM-DD'),
    },
    bulkSendListInfo: [],
};

export default handleActions(
    {
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_BM_STORE]: () => bmInitialState,
        [act.CLEAR_BM_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = bmInitialState.total;
                draft.totalList = bmInitialState.totalList;
                draft.error = bmInitialState.error;
            });
        },
        [act.CLEAR_BM_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = bmInitialState.search;
            });
        },
        /**
         * 검색조건 변경
         */
        [act.CHANGE_BM_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 벌크 모니터링 전체 건수 조회
         */
        [act.GET_BULK_STAT_TOTAL_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.totalList = body.list;
                draft.error = bmInitialState.error;
            });
        },
        [act.GET_BULK_STAT_TOTAL_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.totalList = bmInitialState.list;
                draft.error = payload;
            });
        },
        /**
         * 벌크 모니터링 전송 목록 조회
         */
        [act.GET_BULK_STAT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.total = body.totalCnt;
                draft.sendList = body.list;
                draft.error = bmInitialState.error;
            });
        },
        [act.GET_BULK_STAT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = bmInitialState.total;
                draft.sendList = bmInitialState.list;
                draft.error = payload;
            });
        },
        /**
         * 벌크 모니터링 전송 상세 정보 조회
         */
        [act.GET_BULK_STAT_LIST_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.sendTotal = body.totalCnt;
                draft.bulkSendListInfo = body.list;
            });
        },
        [act.GET_BULK_STAT_LIST_INFO_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.sendTotal = bmInitialState.totalCnt;
                draft.bulkSendListInfo = bmInitialState.bulkSendListInfo;
            });
        },
    },
    bmInitialState,
);
