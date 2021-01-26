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
    tourGuideList: [],
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
                draft.tourGuideList = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_TOUR_GUIDE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.tourGuideList = initialState.list;
                draft.total = initialState.total;
            });
        },
    },
    initialState,
);
