import { handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import * as act from './searchKeywordAction';
import { PAGESIZE_OPTIONS, DB_DATEFORMAT } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    stat: {
        total: 0,
        list: [],
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'schKwd',
            keyword: '',
            startDt: null,
            endDt: null,
        },
        searchTypeList: [
            { id: 'all', name: 'PC/M 전체' },
            { id: 'PC', name: 'PC' },
            { id: 'MOBILE', name: 'MOBILE' },
        ],
        searchDate: null,
    },
    statTotal: {
        totalCnt: 0,
        mobileCnt: 0,
        pcCnt: 0,
        tabletCnt: 0,
    },
    statDetail: {
        total: 0,
        list: [],
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'schKwd',
            keyword: '',
            startDt: null,
            endDt: null,
        },
    },
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 검색 조건 변경
         */
        [act.CHANGE_STAT_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.stat.search = payload;
            });
        },
        [act.CHANGE_DETAIL_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.statDetail.search = payload;
            });
        },
        /**
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_STAT_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.statDetail = initialState.statDetail;
            });
        },
        /**
         * 통계 조회
         */
        [act.GET_SEARCH_KEYWORD_STAT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.stat.total = body.totalCnt;
                draft.stat.list = body.list;
                draft.stat.error = initialState.stat.error;
                draft.stat.searchDate = moment().format(DB_DATEFORMAT);
            });
        },
        [act.GET_SEARCH_KEYWORD_STAT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.stat.total = initialState.stat.totalCnt;
                draft.stat.list = initialState.stat.list;
                draft.stat.error = payload;
                draft.stat.searchDate = moment().format(DB_DATEFORMAT);
            });
        },
        /**
         * 통계 전체 건수
         */
        [act.GET_SEARCH_KEYWORD_STAT_TOTAL_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.statTotal = body;
            });
        },
    },
    initialState,
);
