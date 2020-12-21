import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleSourceAction';

/**
 * initialState
 */
export const initialState = {
    sourceList: null,
    blukSourceList: null,
};

export default handleActions(
    {
        // 매체 조회
        [act.GET_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.sourceList = body.list;
            });
        },
        [act.GET_SOURCE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.sourceList = initialState.sourceList;
            });
        },
        // 벌크 매체 조회
        [act.GET_BLUK_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.blukSourceList = body.list;
            });
        },
        [act.GET_BLUK_SOURCE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.blukSourceList = initialState.blukSourceList;
            });
        },
    },
    initialState,
);
