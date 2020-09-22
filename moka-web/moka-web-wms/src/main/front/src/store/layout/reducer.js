import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './action';
import { changeThemeStyle } from '@util/stylesheetUtil';

const initialState = {
    sidebarIsOpen: true,
    sidebarIsSticky: true,
    layoutIsBoxed: false,
    theme: 'classic',
    sidebarOpenItem: {}
};

export default handleActions(
    {
        /** 테마 */
        [act.CHANGE_THEME]: (state, { payload }) => {
            return produce(state, (draft) => {
                if (payload === 'classic' || payload === 'corporate' || payload === 'modern') {
                    draft.theme = payload;
                    changeThemeStyle(payload, 'theme');
                }
            });
        },
        /** 레이아웃 */
        [act.ENABLE_BOXED_LAYOUT]: (state) => {
            return produce(state, (draft) => {
                draft.layoutIsBoxed = true;
            });
        },
        [act.DISABLE_BOXED_LAYOUT]: (state) => {
            return produce(state, (draft) => {
                draft.layoutIsBoxed = false;
            });
        },
        /** 사이드바 */
        [act.SHOW_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsOpen = true;
            });
        },
        [act.HIDE_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsOpen = false;
            });
        },
        [act.TOGGLE_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsOpen = !draft.sidebarIsOpen;
            });
        },
        [act.TOGGLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsSticky = !draft.sidebarIsSticky;
            });
        },
        [act.ENABLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsSticky = true;
            });
        },
        [act.DISABLE_STICKY_SIDEBAR]: (state) => {
            return produce(state, (draft) => {
                draft.sidebarIsSticky = false;
            });
        },
        /** 사이드바 오픈아이템 변경 */
        [act.INIT_SIDEBAR_OPEN_ITEM]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.sidebarOpenItem = payload;
            });
        },
        [act.CHANGE_SIDEBAR_OPEN_ITEM]: (state, { payload: { menuId, toggleValue } }) => {
            return produce(state, (draft) => {
                draft.sidebarOpenItem[menuId] = toggleValue;
            });
        }
    },
    initialState
);
