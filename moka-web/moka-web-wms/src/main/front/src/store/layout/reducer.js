import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './action';
import { changeThemeStyle } from '@util/stylesheetUtil';

const initialState = {
    isOpen: true,
    isSticky: true,
    isBoxed: false,
    theme: 'classic'
};

export default handleActions(
    {
        /** 테마 */
        [act.CHANGE_THEME]: (state, payload) => {
            return produce(state, (draft) => {
                if (payload === 'classic' || payload === 'corporate' || payload === 'modern') {
                    draft.theme = payload;
                    changeThemeStyle(payload);
                }
            });
        },
        /** 레이아웃 */
        [act.ENABLE_BOXED_LAYOUT]: (state) => {
            return produce(state, (draft) => {
                draft.isBoxed = true;
            });
        },
        [act.DISABLE_BOXED_LAYOUT]: (state) => {
            return produce(state, (draft) => {
                draft.isBoxed = false;
            });
        },
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
