import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'comment/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 차단 메뉴 구분값 처리
 */
export const INITIALIZE_BANNED_PARAMS = 'comment/INITIALIZE_BANNED_PARAMS';
export const initializeBannedParams = createAction(INITIALIZE_BANNED_PARAMS);

/**
 * 공통 구분값 처리
 */
export const [GET_INIT_DATA, GET_INIT_DATA_SUCCESS, GET_INIT_DATA_FAILURE] = createRequestActionTypes('comment/GET_INIT_DATA');
export const getInitData = createAction(GET_INIT_DATA, (...actions) => actions);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'comment/CLEAR_COMMENT_ALL';
export const CLEAR_COMMENT = 'comment/CLEAR_COMMENT';
export const CLEAR_LIST = 'comment/CLEAR_LIST';
export const CLEAR_SEARCH = 'comment/CLEAR_SEARCH';
export const CLEAR_BLOCKS_LIST = 'comment/CLEAR_BLOCKS_LIST';
export const CLEAR_BLOCK_HISTORY = 'comment/CLEAR_BLOCK_HISTORY';
export const clearStore = createAction(CLEAR_STORE);
export const clearComment = createAction(CLEAR_COMMENT);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearBlocksList = createAction(CLEAR_BLOCKS_LIST);
export const clearBlockHistory = createAction(CLEAR_BLOCK_HISTORY);

/**
 * 데이터 조회
 */
export const [GET_COMMENT_LIST, GET_COMMENT_LIST_SUCCESS, GET_COMMENT_LIST_FAILURE] = createRequestActionTypes('comment/GET_COMMENT_LIST');
export const getCommentList = createAction(GET_COMMENT_LIST, (...actions) => actions);

/**
 * 데이터 변경
 */
export const CHANGE_COMMENT = 'comment/CHANGE_COMMENT';
export const CHANGE_INVALID_LIST = 'comment/CHANGE_INVALID_LIST';
export const changeComment = createAction(CHANGE_COMMENT, (comment) => comment);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 댓글 삭제
 */
export const [DELETE_COMMENT, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE] = createRequestActionTypes('comment/DELETE_COMMENT');
export const deleteComment = createAction(DELETE_COMMENT, ({ cmtSeq, params, callback }) => ({ cmtSeq, params, callback }));

/**
 * 차단 관리
 */
export const [GET_COMMENTS_BLOCKS, GET_COMMENTS_BLOCKS_SUCCESS, GET_COMMENTS_BLOCKS_FAILURE] = createRequestActionTypes('comment/GET_COMMENTS_BLOCKS');
export const getCommentsBlocks = createAction(GET_COMMENTS_BLOCKS, (...actions) => actions);

export const CHANGE_BANNEDS_SEARCH_OPTION = 'comment/CHANGE_BANNEDS_SEARCH_OPTION';
export const changeBannedsSearchOption = createAction(CHANGE_BANNEDS_SEARCH_OPTION, (search) => search);

/**
 * 차단 등록, 수정
 */
export const SAVE_BLOCKS = 'comment/SAVE_BLOCKS';
export const saveBlocks = createAction(SAVE_BLOCKS, ({ type, seqNo, blockFormData, callback }) => ({ type, seqNo, blockFormData, callback }));

/**
 * 차단 목록 차단,복원
 */
export const BLOCKS_USED = 'comment/BLOCKS_USED';
export const blocksUsed = createAction(BLOCKS_USED, ({ seqNo, usedYn, callback }) => ({ seqNo, usedYn, callback }));

/**
 * 차단 히스토리 목록
 */
export const [GET_BLOCK_HISTORY, GET_BLOCK_HISTORY_SUCCESS, GET_BLOCK_HISTORY_FAILURE] = createRequestActionTypes('comment/GET_BLOCK_HISTORY');
export const getBlockHistory = createAction(GET_BLOCK_HISTORY, ({ seqNo }) => ({ seqNo: seqNo }));
