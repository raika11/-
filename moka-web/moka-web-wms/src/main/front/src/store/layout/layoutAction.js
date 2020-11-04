import { createAction } from 'redux-actions';

/** 테마 변경 */
export const CHANGE_THEME = 'layout/CHANGE_THEME';

/** 테마 변경 creator */
export const changeTheme = createAction(CHANGE_THEME, (payload) => payload);

/** 레이아웃 박스타입 변경 */
export const ENABLE_BOXED_LAYOUT = 'layout/ENABLE_BOXED_LAYOUT';
export const DISABLE_BOXED_LAYOUT = 'layout/DISABLE_BOXED_LAYOUT';

/** 레이아웃 박스타입 변경 creator */
export const enableBoxedLayout = createAction(ENABLE_BOXED_LAYOUT);
export const disableBoxedLayout = createAction(DISABLE_BOXED_LAYOUT);

/** 사이드바 액션 */
export const OPEN_SIDEBAR = 'layout/OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'layout/CLOSE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'layout/TOGGLE_SIDEBAR';
export const TOGGLE_STICKY_SIDEBAR = 'layout/TOGGLE_STICKY_SIDEBAR';
export const ENABLE_STICKY_SIDEBAR = 'layout/ENABLE_STICKY_SIDEBAR';
export const DISABLE_STICKY_SIDEBAR = 'layout/DISABLE_STICKY_SIDEBAR';

/** 사이드바 액션 creator */
export const openSidebar = createAction(OPEN_SIDEBAR);
export const closeSidebar = createAction(CLOSE_SIDEBAR);
export const toggleSidebar = createAction(TOGGLE_SIDEBAR);
export const toggleStickySidebar = createAction(TOGGLE_STICKY_SIDEBAR);
export const enableStickySidebar = createAction(ENABLE_STICKY_SIDEBAR);
export const disableStickySidebar = createAction(DISABLE_STICKY_SIDEBAR);

/** 사이드바 열린 메뉴 변경 */
export const INIT_SIDEBAR_OPEN_ITEM = 'layout/INIT_SIDEBAR_OPEN_ITEM';
export const CHANGE_SIDEBAR_OPEN_ITEM = 'layout/CHANGE_SIDEBAR_OPEN_ITEM';

/** 사이드바 열린 메뉴 변경 creator */
export const initSidebarOpenItem = createAction(INIT_SIDEBAR_OPEN_ITEM, (payload) => payload);
export const changeSidebarOpenItem = createAction(CHANGE_SIDEBAR_OPEN_ITEM, (payload) => payload);
