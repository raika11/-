import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'menu/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'menu/CLEAR_MENU_ALL';
export const CLEAR_MENU = 'menu/CLEAR_MENU';
export const CLEAR_LIST = 'menu/CLEAR_LIST';
export const CLEAR_SEARCH = 'menu/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearMenu = createAction(CLEAR_MENU);
export const clearList = createAction(CLEAR_LIST);

/**
 * 데이터 조회
 */
export const [GET_MENU_LIST, GET_MENU_LIST_SUCCESS, GET_MENU_LIST_FAILURE] = createRequestActionTypes('menu/GET_MENU_LIST');
export const [GET_MENU, GET_MENU_SUCCESS, GET_MENU_FAILURE] = createRequestActionTypes('menu/GET_MENU');
export const getMenuList = createAction(GET_MENU_LIST, (...actions) => actions);
export const getMenu = createAction(GET_MENU, (menuId) => menuId);

/**
 * 데이터 변경
 */
export const CHANGE_MENU = 'menu/CHANGE_MENU';
export const CHANGE_INVALID_LIST = 'menu/CHANGE_INVALID_LIST';
export const changeMenu = createAction(CHANGE_MENU, (menu) => menu);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 메뉴ID 중복체크
 */
export const DUPLICATE_CHECK_ID = 'menu/DUPLICATE_CHECK_ID';
export const duplicateCheckId = createAction(DUPLICATE_CHECK_ID, ({ menuId, callback }) => ({ menuId, callback }));

/**
 * 저장
 */
export const SAVE_MENU = 'menu/SAVE_MENU';
export const saveMenu = createAction(SAVE_MENU, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 메뉴를 사용하고있는 그룹 및 사용자 체크
 */
export const EXIST_AUTH = 'menu/EXIST_AUTH';
export const existAuth = createAction(EXIST_AUTH, ({ menuId, callback }) => ({ menuId, callback }));

/**
 * 삭제
 */
export const [DELETE_MENU, DELETE_MENU_SUCCESS, DELETE_MENU_FAILURE] = createRequestActionTypes('menu/DELETE_MENU');
export const deleteMenu = createAction(DELETE_MENU, ({ menuId, callback }) => ({ menuId, callback }));
