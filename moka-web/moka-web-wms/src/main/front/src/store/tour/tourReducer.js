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
    // tourGuideList: [],
    tourSetup: {},
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
    },
    initialState,
);
