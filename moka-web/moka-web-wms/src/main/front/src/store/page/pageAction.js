import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'page/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'page/CLEAR_STORE';
export const CLEAR_PAGE = 'page/CLEAR_PAGE';
export const CLEAR_TREE = 'page/CLEAR_TREE';
export const CLEAR_SEARCH = 'page/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'page/CLEAR_RELATION_LIST';
export const CLEAR_HISTORY = 'page/CLEAR_HISTORY';
export const clearStore = createAction(CLEAR_STORE);
export const clearPage = createAction(CLEAR_PAGE);
export const clearTree = createAction(CLEAR_TREE);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);
export const clearHistory = createAction(CLEAR_HISTORY);

/**
 * 데이터 조회
 */
export const [GET_PAGE_TREE, GET_PAGE_TREE_SUCCESS, GET_PAGE_TREE_FAILURE] = createRequestActionTypes('page/GET_PAGE_TREE');
export const [GET_PAGE, GET_PAGE_SUCCESS, GET_PAGE_FAILURE] = createRequestActionTypes('page/GET_PAGE');
export const getPageTree = createAction(GET_PAGE_TREE, (...actions) => actions);
export const getPage = createAction(GET_PAGE, ({ pageSeq, callback }) => ({ pageSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_PAGE_BODY = 'page/CHANGE_PAGE_BODY';
export const CHANGE_PAGE = 'page/CHANGE_PAGE';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
export const changePageBody = createAction(CHANGE_PAGE_BODY, (pageBody) => pageBody);
export const changePage = createAction(CHANGE_PAGE, (page) => page);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_PAGE = 'page/SAVE_PAGE';
export const savePage = createAction(SAVE_PAGE, ({ actions, callback }) => ({ actions, callback }));

/**
 * 삭제
 */
export const [DELETE_PAGE, DELETE_PAGE_SUCCESS] = createRequestActionTypes('page/DELETE_PAGE');
export const deletePage = createAction(DELETE_PAGE, ({ pageSeq, callback }) => ({ pageSeq, callback }));

/**
 * 관련아이템 검색조건 변경
 */
export const CHANGE_SEARCH_PG_OPTION = 'page/CHANGE_SEARCH_PG_OPTION';
export const CHANGE_SEARCH_SK_OPTION = 'page/CHANGE_SEARCH_SK_OPTION';
export const CHANGE_SEARCH_CT_OPTION = 'page/CHANGE_SEARCH_CT_OPTION';
export const CHANGE_SEARCH_CP_OPTION = 'page/CHANGE_SEARCH_CP_OPTION';
export const CHANGE_SEARCH_TP_OPTION = 'page/CHANGE_SEARCH_TP_OPTION';
export const changeSearchPGOption = createAction(CHANGE_SEARCH_PG_OPTION, (search) => search);
export const changeSearchSKOption = createAction(CHANGE_SEARCH_SK_OPTION, (search) => search);
export const changeSearchCTOption = createAction(CHANGE_SEARCH_CT_OPTION, (search) => search);
export const changeSearchCPOption = createAction(CHANGE_SEARCH_CP_OPTION, (search) => search);
export const changeSearchTPOption = createAction(CHANGE_SEARCH_TP_OPTION, (search) => search);

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'page/HAS_RELATION_LIST';
export const [GET_RELATION_LIST, GET_RELATION_LIST_SUCCESS, GET_RELATION_LIST_FAILURE] = createRequestActionTypes('page/GET_RELATION_LIST');
export const hasRelationList = createAction(HAS_RELATION_LIST, (payload) => payload);
export const getRelationPGList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'PG',
}));
export const getRelationSKList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'SK',
}));
export const getRelationCTList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CT',
}));
export const getRelationCPList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CP',
}));
export const getRelationTPList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'TP',
}));

/**
 * 히스토리 검색조건 변경
 */
export const CHANGE_SEARCH_HIST_OPTION = 'page/CHANGE_SEARCH_HIST_OPTION';
export const changeSearchHistOption = createAction(CHANGE_SEARCH_HIST_OPTION, (search) => search);

/**
 * 히스토리 데이터 조회
 */
export const [GET_HISTORY_LIST, GET_HISTORY_LIST_SUCCESS, GET_HISTORY_LIST_FAILURE] = createRequestActionTypes('page/GET_HISTORY_LIST');
export const [GET_HISTORY, GET_HISTORY_SUCCESS, GET_HISTORY_FAILURE] = createRequestActionTypes('page/GET_HISTORY');
export const getHistoryList = createAction(GET_HISTORY_LIST, (...actions) => actions);
export const getHistory = createAction(GET_HISTORY, ({ pageSeq, histSeq }) => ({ pageSeq, histSeq }));
