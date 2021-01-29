import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './tourAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    holidayList: [],
    tourSetup: {},
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'tourSeq,desc',
        startTourDay: null,
        endTourDay: null,
        keyword: '',
    },
    tourApply: {},
    invalidList: [],
};

export default handleActions(
    {
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 견학 메세지 설정 목록
         */
        [act.GET_TOUR_GUIDE_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_TOUR_GUIDE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 견학 휴일 목록조회(매년반복)
         */
        [act.GET_TOUR_DENY_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.holidayList = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_TOUR_DENY_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.holidayList = initialState.holidayList;
                draft.total = initialState.total;
            });
        },
        /**
         * 견학 기본 설정 조회
         */
        [act.GET_TOUR_SETUP_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.tourSetup = body;
            });
        },
        [act.GET_TOUR_SETUP_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.tourSetup = initialState.tourSetup;
            });
        },
        /**
         * 견학 신청 목록 조회
         */
        [act.GET_TOUR_APPLY_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_TOUR_APPLY_LIST_FAILURE]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = payload;
            });
        },
        /**
         * 견학 신청 상세 조회
         */
        [act.GET_TOUR_APPLY_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.tourApply = body;
                draft.invalidList = initialState.invalidList;
            });
        },
    },
    initialState,
);
