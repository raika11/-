import { createAction } from 'redux-actions';

/** 사이드바 액션 */
export const SHOW_SIDEBAR = 'layout/SHOW_SIDEBAR';
export const HIDE_SIDEBAR = 'layout/HIDE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'layout/TOGGLE_SIDEBAR';
export const TOGGLE_STICKY_SIDEBAR = 'layout/TOGGLE_STICKY_SIDEBAR';
export const ENABLE_STICKY_SIDEBAR = 'layout/ENABLE_STICKY_SIDEBAR';
export const DISABLE_STICKY_SIDEBAR = 'layout/DISABLE_STICKY_SIDEBAR';

/** 사이드바 액션 creator */
export const showSidebar = createAction(SHOW_SIDEBAR);
export const hideSidebar = createAction(HIDE_SIDEBAR);
export const toggleSidebar = createAction(TOGGLE_SIDEBAR);
export const toggleStickySidebar = createAction(TOGGLE_STICKY_SIDEBAR);
export const enableStickySidebar = createAction(ENABLE_STICKY_SIDEBAR);
export const disableStickySidebar = createAction(DISABLE_STICKY_SIDEBAR);
