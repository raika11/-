import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/reporter/reporterAction';
import { PAGESIZE_OPTIONS } from '@/constants';
import qs from 'qs';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    error: null,
    search: {
        page: 0,
        searchType: 'all',
        sort: 'repSeq,asc',
        keyword: '',
    },
    reporter: {},
    reporterError: {},
    invalidList: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.search = newSearch;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reporter = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        [act.CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.reporterError = initialState.reporterError;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.reporterError = initialState.reporterError;
                draft.invalidList = initialState.invalidList;
            });
        },

        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 목록
         */
        [act.GET_REPORTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            //console.log('성공듀서탓음::', decodeURIComponent(qs.stringify(body)));
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_REPORTER_LIST_FAILURE]: (state, { payload }) => {
            //console.log('실패듀서탓음::' + decodeURIComponent(qs.stringify(payload)));

            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_REPORTER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reporter = body;
                draft.reporterError = initialState.reporterError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_REPORTER_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.reporterError = payload;
                draft.invalidList = body;
            });
        },
    },
    initialState,
);
