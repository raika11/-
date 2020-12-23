import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleSourceAction';

/**
 * initialState
 */
export const initialState = {
    deskingSourceList: null,
    typeSourceList: {},
};

export default handleActions(
    {
        // 데스킹 매체 조회
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
        // 타입별 매체 조회
        [act.GET_TYPE_SOURCE_LIST_SUCCESS]: (state, { payload: { body, payload } }) => {
            return produce(state, (draft) => {
                draft.typeSourceList[payload.type] = body.list;
            });
        },
        [act.GET_TYPE_SOURCE_LIST_FAILURE]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.typeSourceList[payload.type] = null;
            });
        },
    },
    initialState,
);
