import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 구분값 처리.
export const INITIALIZE_PARAMS = 'boards/INITIALIZE_PARAMS';
export const initializeParams = createAction(INITIALIZE_PARAMS);

export const CLEAR_STORE = 'boards/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

/** set 메뉴 */
// 검색 옵션 변경.
export const CHANGE_SETMENU_SEARCH_OPTION = 'boards/CHANGE_SETMENU_SEARCH_OPTION';
export const changeSetMenuSearchOption = createAction(CHANGE_SETMENU_SEARCH_OPTION, (actions) => actions);
export const CLEAR_SETMENU_SEARCH_OPTION = 'boards/CLEAR_SETMENU_SEARCH_OPTION';
export const clearSetMenuSearchOption = createAction(CLEAR_SETMENU_SEARCH_OPTION);

// 게시판 리스트 조회.
export const [GET_SETMENU_BOARD_LIST, GET_SETMENU_BOARD_LIST_SUCCESS, GET_SETMENU_BOARD_LIST_FAILURE] = createRequestActionTypes('boards/GET_SETMENU_BOARD_LIST');
export const getSetmenuBoardsList = createAction(GET_SETMENU_BOARD_LIST, (...actions) => actions);

// 게시판 상세 조회.
export const [GET_SETMENU_BOARD_INFO, GET_SETMENU_BOARD_INFO_SUCCESS, GET_SETMENU_BOARD_INFO_FAILURE] = createRequestActionTypes('boards/GET_SETMENU_BOARD_INFO');
export const getBoardInfo = createAction(GET_SETMENU_BOARD_INFO, ({ boardId }) => ({ boardId }));

export const CLEAR_SETMENU_BOARD_INFO = 'boards/CLEAR_SETMENU_BOARD_INFO';
export const clearSetmenuBoardInfo = createAction(CLEAR_SETMENU_BOARD_INFO);

// 게시판 저장 조회.
export const [SAVE_SETMENU_BOARD_INFO, SAVE_SETMENU_BOARD_INFO_SUCCESS, SAVE_SETMENU_BOARD_INFO_FAILURE] = createRequestActionTypes('boards/SAVE_SETMENU_BOARD_INFO');
export const saveBoardInfo = createAction(SAVE_SETMENU_BOARD_INFO, ({ type, boardinfo, callback }) => ({ type, boardinfo, callback }));

// 게시판 삭제.
export const [DELETE_SETMENU_BOARD, DELETE_SETMENU_BOARD_SUCCESS, DELETE_SETMENU_BOARD_FAILURE] = createRequestActionTypes('boards/DELETE_SETMENU_BOARD');
export const deleteBoard = createAction(DELETE_SETMENU_BOARD, ({ boardId, callback }) => ({ boardId, callback }));

/** list 메뉴 */
export const [GET_BOARD_GROUP_LIST, GET_GROUP_LIST_SUCCESS, GET_GROUP_LIST_FAILURE] = createRequestActionTypes('boards/GET_BOARD_GROUP_LIST');
export const getBoardGroupList = createAction(GET_BOARD_GROUP_LIST, (...actions) => actions);
