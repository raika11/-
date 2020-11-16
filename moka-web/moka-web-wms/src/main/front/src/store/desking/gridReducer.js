import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './gridAction';

/**
 * initial
 */
export const initialState = {
    total: 0,
};

/**
 * reducer
 */
export default handleActions(
    {
        // 데이터 삭제
        [act.CLEAR_GRID]: () => initialState,

        // 그리드 변경
        [act.CHANGE_GRID]: (state) => {
            return produce(state, (draft) => {
                draft.total++;
            });
        },
    },
    initialState,
);
