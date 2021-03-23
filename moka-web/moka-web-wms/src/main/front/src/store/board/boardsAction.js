import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 구분값 처리
 */
export const INITIALIZE_PARAMS = 'board/INITIALIZE_PARAMS';
export const initializeParams = createAction(INITIALIZE_PARAMS);

/**
 * 스토어 초기화
 */
export const CLEAR_STORE = 'board/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_SET_MENU_BOARD_INFO = 'board/CLEAR_SET_MENU_BOARD_INFO';
export const clearSetmenuBoardInfo = createAction(CLEAR_SET_MENU_BOARD_INFO);
export const CLEAR_LIST_MENU_SEARCH_OPTION = 'board/CLEAR_LIST_MENU_SEARCH_OPTION';
export const clearListMenuSearchOption = createAction(CLEAR_LIST_MENU_SEARCH_OPTION);
export const CLEAR_LIST_MENU_CONTENTS_INFO = 'board/CLEAR_LIST_MENU_CONTENTS_INFO';
export const clearListMenuContentsInfo = createAction(CLEAR_LIST_MENU_CONTENTS_INFO);

/**
 * 게시판 등록 시 사용할 채널 타입 목록
 */
export const [GET_BOARD_CHANNEL_TYPE_LIST, GET_BOARD_CHANNEL_TYPE_LIST_SUCCESS, GET_BOARD_CHANNEL_TYPE_LIST_FAILURE] = createRequestActionTypes(
    'board/GET_BOARD_CHANNEL_TYPE_LIST',
);
export const getBoardChannelTypeList = createAction(GET_BOARD_CHANNEL_TYPE_LIST, (...actions) => actions);

/**
 * 게시판 channalType 별 목록 가지고 오기(saga callback으로 목록 전달)
 */
export const GET_BOARD_CHANNEL_LIST = 'board/GET_BOARD_CHANNEL_LIST';
export const getBoardChannelList = createAction(GET_BOARD_CHANNEL_LIST, ({ type, callback }) => ({ type, callback }));

/** set 메뉴 */

/**
 * 검색 옵션 변경
 */
export const CHANGE_SET_MENU_SEARCH_OPTION = 'board/CHANGE_SET_MENU_SEARCH_OPTION';
export const changeSetMenuSearchOption = createAction(CHANGE_SET_MENU_SEARCH_OPTION, (actions) => actions);
export const CLEAR_SET_MENU_SEARCH_OPTION = 'board/CLEAR_SET_MENU_SEARCH_OPTION';
export const clearSetMenuSearchOption = createAction(CLEAR_SET_MENU_SEARCH_OPTION);

/**
 * 전체 게시판 목록 조회
 */
export const [GET_SET_MENU_BOARD_LIST, GET_SET_MENU_BOARD_LIST_SUCCESS, GET_SET_MENU_BOARD_LIST_FAILURE] = createRequestActionTypes('board/GET_SET_MENU_BOARD_LIST');
export const getSetMenuBoardsList = createAction(GET_SET_MENU_BOARD_LIST, (...actions) => actions);

/**
 * 전체 게시판 상세 조회
 */
export const [GET_SET_MENU_BOARD_INFO, GET_SET_MENU_BOARD_INFO_SUCCESS, GET_SET_MENU_BOARD_INFO_FAILURE] = createRequestActionTypes('board/GET_SET_MENU_BOARD_INFO');
export const getBoardInfo = createAction(GET_SET_MENU_BOARD_INFO, (boardId) => boardId);

/**
 * 전체 게시판 저장
 */
export const SAVE_BOARD_INFO = 'board/SAVE_BOARD_INFO';
export const saveBoardInfo = createAction(SAVE_BOARD_INFO, ({ boardInfo, callback }) => ({ boardInfo, callback }));

/**
 * 전체 게시판 삭제
 */
export const [DELETE_SET_MENU_BOARD, DELETE_SET_MENU_BOARD_SUCCESS, DELETE_SET_MENU_BOARD_FAILURE] = createRequestActionTypes('board/DELETE_SET_MENU_BOARD');
export const deleteBoard = createAction(DELETE_SET_MENU_BOARD, ({ boardId, callback }) => ({ boardId, callback }));

/** list 메뉴 */

/**
 * 검색 옵션 변경
 */
export const CHANGE_LIST_MENU_SEARCH_OPTION = 'board/CHANGE_LIST_MENU_SEARCH_OPTION';
export const changeListMenuSearchOption = createAction(CHANGE_LIST_MENU_SEARCH_OPTION, (search) => search);

/**
 * 게시판 유형 그룹별 게시판 목록
 */
export const [GET_BOARD_GROUP_LIST, GET_BOARD_GROUP_LIST_SUCCESS] = createRequestActionTypes('board/GET_BOARD_GROUP_LIST');
export const getBoardGroupList = createAction(GET_BOARD_GROUP_LIST);

/**
 * 게시글 게시판 선택 정보
 */
export const [GET_LIST_MENU_SELECT_BOARD, GET_LIST_MENU_SELECT_BOARD_SUCCESS, GET_LIST_MENU_SELECT_BOARD_FAILURE] = createRequestActionTypes('board/GET_LIST_MENU_SELECT_BOARD');
export const getListMenuSelectBoard = createAction(GET_LIST_MENU_SELECT_BOARD, (boardId) => boardId);

/**
 * 게시글 게시판 목록
 */
export const [GET_LIST_MENU_CONTENTS_LIST, GET_LIST_MENU_CONTENTS_LIST_SUCCESS, GET_LIST_MENU_CONTENTS_LIST_FAILURE] = createRequestActionTypes(
    'board/GET_LIST_MENU_CONTENTS_LIST',
);
export const getListMenuContentsList = createAction(GET_LIST_MENU_CONTENTS_LIST, (boardId) => boardId);

/**
 * 게시글 게시판 상세 조회
 */
export const [GET_LIST_MENU_CONTENTS_INFO, GET_LIST_MENU_CONTENTS_INFO_SUCCESS, GET_LIST_MENU_CONTENTS_INFO_FAILURE] = createRequestActionTypes(
    'board/GET_LIST_MENU_CONTENTS_INFO',
);
export const getListMenuContentsInfo = createAction(GET_LIST_MENU_CONTENTS_INFO, ({ boardId, boardSeq }) => ({ boardId, boardSeq }));

/**
 * 게시글 정보 내용 변경
 */
export const CHANGE_LIST_MENU_CONTENTS = 'board/CHANGE_LIST_MENU_CONTENT';
export const changeListMenuContents = createAction(CHANGE_LIST_MENU_CONTENTS, ({ content }) => ({ content }));

/**
 * 게시글 답변 내용 변경
 */
export const CHANGE_LIST_MENU_REPLY_CONTENTS = 'board/CHANGE_LIST_MENU_REPLY_CONTENT';
export const changeListMenuReplyContents = createAction(CHANGE_LIST_MENU_REPLY_CONTENTS, ({ content }) => ({ content }));

/**
 * 게시글 정보 저장
 */
export const [SAVE_BOARD_CONTENTS, SAVE_BOARD_CONTENTS_SUCCESS, SAVE_BOARD_CONTENTS_FAILURE] = createRequestActionTypes('board/SAVE_BOARD_CONTENTS');
export const saveBoardContents = createAction(SAVE_BOARD_CONTENTS, ({ boardId, formData, callback }) => ({ boardId, formData, callback }));

/**
 * 게시글 정보 수정
 */
export const [UPDATE_BOARD_CONTENTS, UPDATE_BOARD_CONTENTS_SUCCESS, UPDATE_BOARD_CONTENTS_FAILURE] = createRequestActionTypes('board/UPDATE_BOARD_CONTENTS');
export const updateBoardContents = createAction(UPDATE_BOARD_CONTENTS, ({ boardId, boardSeq, formData, callback }) => ({ boardId, boardSeq, formData, callback }));

/**
 * 게시글 정보 삭제
 */
export const DELETE_BOARD_CONTENTS = 'board/DELETE_BOARD_CONTENTS';
export const deleteBoardContents = createAction(DELETE_BOARD_CONTENTS, ({ boardId, boardSeq, callback }) => ({ boardId, boardSeq, callback }));

/**
 * 게시글 답변 저장
 */
export const SAVE_BOARD_REPLY = 'board/SAVE_BOARD_REPLY';
export const saveBoardReply = createAction(SAVE_BOARD_REPLY, ({ boardId, parentBoardSeq, boardSeq, contents, callback }) => ({
    boardId,
    parentBoardSeq,
    boardSeq,
    contents,
    callback,
}));

/**
 * 게시글 썸머노트 이미지 업로드
 */
export const UPLOAD_BOARD_CONTENTS_IMAGE = 'board/UPLOAD_BOARD_CONTENTS_IMAGE';
export const uploadBoardContentsImage = createAction(UPLOAD_BOARD_CONTENTS_IMAGE, ({ boardId, imageForm, callback }) => ({ boardId, imageForm, callback }));
