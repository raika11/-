import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 구분값 처리
 */
export const INITIALIZE_PARAMS = 'board/INITIALIZE_PARAMS';
export const initializeParams = createAction(INITIALIZE_PARAMS);

export const CLEAR_STORE = 'board/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

export const [GET_BOARD_CHANNELTYPE_LIST, GET_BOARD_CHANNELTYPE_LIST_SUCCESS, GET_BOARD_CHANNELTYPE_LIST_FAILURE] = createRequestActionTypes('board/GET_BOARD_CHANNELTYPE_LIST');
export const getBoardChannelTypeList = createAction(GET_BOARD_CHANNELTYPE_LIST, (...actions) => actions);

// 게시판 channalType 별 목록 가지고 오기. ( store 를 거치지 않고 call back 으로 목록 전달.)
export const [GET_BOARD_CHANNEL_LIST] = createRequestActionTypes('board/GET_BOARD_CHANNEL_LIST');
export const getBoardChannelList = createAction(GET_BOARD_CHANNEL_LIST, ({ type, callback }) => ({ type, callback }));

/** set 메뉴 */
// 검색 옵션 변경.
export const CHANGE_SETMENU_SEARCH_OPTION = 'board/CHANGE_SETMENU_SEARCH_OPTION';
export const changeSetMenuSearchOption = createAction(CHANGE_SETMENU_SEARCH_OPTION, (actions) => actions);
export const CLEAR_SETMENU_SEARCH_OPTION = 'board/CLEAR_SETMENU_SEARCH_OPTION';
export const clearSetMenuSearchOption = createAction(CLEAR_SETMENU_SEARCH_OPTION);

// 게시판 리스트 조회.
export const [GET_SETMENU_BOARD_LIST, GET_SETMENU_BOARD_LIST_SUCCESS, GET_SETMENU_BOARD_LIST_FAILURE] = createRequestActionTypes('board/GET_SETMENU_BOARD_LIST');
export const getSetmenuBoardsList = createAction(GET_SETMENU_BOARD_LIST, (...actions) => actions);

// 게시판 상세 조회.
export const [GET_SETMENU_BOARD_INFO, GET_SETMENU_BOARD_INFO_SUCCESS, GET_SETMENU_BOARD_INFO_FAILURE] = createRequestActionTypes('board/GET_SETMENU_BOARD_INFO');
export const getBoardInfo = createAction(GET_SETMENU_BOARD_INFO, ({ boardId }) => ({ boardId }));

// 게시판 상제 조회 내용 clear.
export const CLEAR_SETMENU_BOARD_INFO = 'board/CLEAR_SETMENU_BOARD_INFO';
export const clearSetmenuBoardInfo = createAction(CLEAR_SETMENU_BOARD_INFO);

// 게시판 저장.
export const [SAVE_SETMENU_BOARD_INFO, SAVE_SETMENU_BOARD_INFO_SUCCESS, SAVE_SETMENU_BOARD_INFO_FAILURE] = createRequestActionTypes('board/SAVE_SETMENU_BOARD_INFO');
export const saveBoardInfo = createAction(SAVE_SETMENU_BOARD_INFO, ({ boardinfo, callback }) => ({ boardinfo, callback }));

// 게시판 삭제.
export const [DELETE_SETMENU_BOARD, DELETE_SETMENU_BOARD_SUCCESS, DELETE_SETMENU_BOARD_FAILURE] = createRequestActionTypes('board/DELETE_SETMENU_BOARD');
export const deleteBoard = createAction(DELETE_SETMENU_BOARD, ({ boardId, callback }) => ({ boardId, callback }));

/** list 메뉴 */
export const [GET_BOARD_GROUP_LIST, GET_GROUP_LIST_SUCCESS, GET_GROUP_LIST_FAILURE] = createRequestActionTypes('board/GET_BOARD_GROUP_LIST');
export const getBoardGroupList = createAction(GET_BOARD_GROUP_LIST, (...actions) => actions);

// 검색 옵션 처리.
export const CHANGE_LISTMENU_SEARCH_OPTION = 'board/CHANGE_LISTMENU_SEARCH_OPTION';
export const changeListmenuSearchOption = createAction(CHANGE_LISTMENU_SEARCH_OPTION, (actions) => actions);

// 게시판 게시글 검색 옵션 클리어.
export const CLEAR_LISTMENU_SEARCH_OPTION = 'board/CLEAR_LISTMENU_SEARCH_OPTION';
export const clearListmenuSearchOption = createAction(CLEAR_LISTMENU_SEARCH_OPTION);

// 게시판 게시글 정보 클리어
export const CLEAR_LISTMENU_CONTENTSINFO = 'board/CLEAR_LISTMENU_CONTENTSINFO';
export const clearListmenuContentsInfo = createAction(CLEAR_LISTMENU_CONTENTSINFO);

// 게시판 답변 정보 초기화.

// 게시글 선택한 게시판 정보 가지고 오기.
export const [GET_LISTMENU_SELECT_BOARD, GET_LISTMENU_SELECT_BOARD_SUCCESS, GET_LISTMENU_SELECT_BOARD_FAILURE] = createRequestActionTypes('board/GET_LISTMENU_SELECT_BOARD');
export const getListmenuSelectBoard = createAction(GET_LISTMENU_SELECT_BOARD, ({ boardId }) => ({ boardId }));

// 게시글 목록 가지고 오기.
export const [GET_LISTMENU_CONTENTS_LIST, GET_LISTMENU_CONTENTS_LIST_SUCCESS, GET_LISTMENU_CONTENTS_LIST_FAILURE] = createRequestActionTypes('board/GET_LISTMENU_CONTENTS_LIST');
export const getListmenuContentsList = createAction(GET_LISTMENU_CONTENTS_LIST, ({ boardId }) => ({ boardId }));

// 게시글 정보 가지고 오기.
export const [GET_LISTMENU_CONTENTS_INFO, GET_LISTMENU_CONTENTS_INFO_SUCCESS, GET_LISTMENU_CONTENTS_INFO_FAILURE] = createRequestActionTypes('board/GET_LISTMENU_CONTENTS_INFO');
export const getListmenuContentsInfo = createAction(GET_LISTMENU_CONTENTS_INFO, ({ boardId, boardSeq }) => ({ boardId, boardSeq }));

// 게시글 정보중 내용 변경.
export const CHANGE_LISTMENU_CONTENT = 'board/CHANGE_LISTMENU_CONTENT';
export const changeListmenuContent = createAction(CHANGE_LISTMENU_CONTENT, ({ content }) => ({ content }));

// 게시글 답변 내용 변경.
export const CHANGE_LISTMENU_REPLY_CONTENT = 'board/CHANGE_LISTMENU_REPLY_CONTENT';
export const changeListmenuReplyContent = createAction(CHANGE_LISTMENU_REPLY_CONTENT, ({ content }) => ({ content }));

// 게시글 정보 저장.
export const [SAVE_BOARD_CONTENTS, SAVE_BOARD_CONTENTS_SUCCESS, SAVE_BOARD_CONTENTS_FAILURE] = createRequestActionTypes('board/SAVE_BOARD_CONTENTS');
export const saveBoardContents = createAction(SAVE_BOARD_CONTENTS, ({ boardId, formData, callback }) => ({ boardId, formData, callback }));

// 게시글 정보 수정.
export const [UPDATE_BOARD_CONTENTS, UPDATE_BOARD_CONTENTS_SUCCESS, UPDATE_BOARD_CONTENTS_FAILURE] = createRequestActionTypes('board/UPDATE_BOARD_CONTENTS');
export const updateBoardContents = createAction(UPDATE_BOARD_CONTENTS, ({ boardId, boardSeq, formData, callback }) => ({ boardId, boardSeq, formData, callback }));

// 게시글 정보 삭제.
export const [DELETE_BOARD_CONTENTS] = createRequestActionTypes('board/DELETE_BOARD_CONTENTS');
export const deleteBoardContents = createAction(DELETE_BOARD_CONTENTS, ({ boardId, boardSeq, callback }) => ({ boardId, boardSeq, callback }));

// 게시글 답변 저장.
export const [SAVE_BOARD_REPLY] = createRequestActionTypes('board/SAVE_BOARD_REPLY');
export const saveBoardReply = createAction(SAVE_BOARD_REPLY, ({ boardId, parentBoardSeq, boardSeq, contents, callback }) => ({
    boardId,
    parentBoardSeq,
    boardSeq,
    contents,
    callback,
}));

// 게시글 본문 이미지 업로드.
export const [UPLOAD_BOARD_CONTENT_IMAGE] = createRequestActionTypes('board/UPLOAD_BOARD_CONTENT_IMAGE');
export const uploadBoardContentImage = createAction(UPLOAD_BOARD_CONTENT_IMAGE, ({ boardId, imageForm, callback }) => ({ boardId, imageForm, callback }));
