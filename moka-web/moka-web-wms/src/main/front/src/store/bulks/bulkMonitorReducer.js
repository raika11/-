import { handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import * as act from './bulkMonitorAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const bmInitialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        searchType: '',
        keyword: '',
        useTotal: '',
        orgSourceCode: null,
        orgSourceName: null,
        contentDiv: null,
        status: '',
        startDt: moment().format('YYYY-MM-DD'),
        endDt: moment().format('YYYY-MM-DD'),
    },
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
                draft.list = bmInitialState.list;
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
                draft.total = body.totalCnt;
                draft.list = body.list;
                draft.error = bmInitialState.error;
            });
        },
        [act.GET_BULK_STAT_TOTAL_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = bmInitialState.total;
                draft.list = bmInitialState.list;
                draft.error = payload;
            });
        },
    },
    bmInitialState,
);
