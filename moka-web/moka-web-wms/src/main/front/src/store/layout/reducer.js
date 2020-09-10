import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './action';

const initialState = {
    isOpen: true,
    isSticky: false
};

export default handleActions(
    {
        /** 사이드바 */
        [act.SHOW_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isOpen = true;
            });
        },
        [act.HIDE_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isOpen = false;
            });
        },
        [act.TOGGLE_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isOpen = !draft.isOpen;
            });
        },
        [act.TOGGLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isSticky = !draft.isSticky;
            });
        },
        [act.ENABLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isSticky = true;
            });
        },
        [act.DISABLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.isSticky = false;
            });
        }
    },
    initialState
);
