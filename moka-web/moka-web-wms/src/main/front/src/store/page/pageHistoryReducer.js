import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './pageAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'relOrd,asc',
        searchType: 'all',
        keyword: '',
    },
    history: {},
    historyError: null,
};

export default handleActions(
    {
        /**
         * 히스토리 검색조건 변경
         */
        [act.CHANGE_SEARCH_HIST_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 스토어 데이터 제거
         */
        [act.CLEAR_HISTORY]: () => initialState,
        /**
         * 히스토리 데이터 조회
         */
        [act.GET_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_HISTORY_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = payload;
            });
        },
        [act.GET_HISTORY_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.history = body;
                draft.historyError = initialState.historyError;
            });
        },
        [act.GET_HISTORY_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.history = initialState.history;
                draft.historyError = payload;
            });
        },
    },
    initialState,
);
