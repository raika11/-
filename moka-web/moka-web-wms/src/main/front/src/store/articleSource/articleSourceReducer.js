import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleSourceAction';

/**
 * initialState
 */
export const initialState = {
    deskingSourceList: null,
};

export default handleActions(
    {
        // 매체 조회
        [act.GET_DESKING_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deskingSourceList = body.list;
            });
        },
        [act.GET_DESKING_SOURCE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.deskingSourceList = initialState.deskingSourceList;
            });
        },
    },
    initialState,
);
