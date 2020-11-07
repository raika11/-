import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 * 기본 리스트 + 관련탭에서 사용하는 lookup 리스트
 */
export const CHANGE_SEARCH_OPTION = 'page/CHANGE_SEARCH_OPTION';
export const CHANGE_LOOKUP_SEARCH_OPTION = 'page/CHANGE_REF_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeLookupSearchOption = createAction(CHANGE_LOOKUP_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'page/CLEAR_STORE';
export const CLEAR_PAGE = 'page/CLEAR_PAGE';
export const CLEAR_TREE = 'page/CLEAR_TREE';
export const CLEAR_SEARCH = 'page/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'page/CLEAR_RELATION_LIST';
export const CLEAR_HISTORY = 'page/CLEAR_HISTORY';
export const CLEAR_LOOKUP = 'page/CLEAR_LOOKUP';
export const clearStore = createAction(CLEAR_STORE);
export const clearPage = createAction(CLEAR_PAGE);
export const clearTree = createAction(CLEAR_TREE);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);
export const clearHistory = createAction(CLEAR_HISTORY);
export const clearLookup = createAction(CLEAR_LOOKUP);

/**
 * 데이터 조회
 */
export const [GET_PAGE_TREE, GET_PAGE_TREE_SUCCESS, GET_PAGE_TREE_FAILURE] = createRequestActionTypes('page/GET_PAGE_TREE');
export const [GET_PAGE, GET_PAGE_SUCCESS, GET_PAGE_FAILURE] = createRequestActionTypes('page/GET_PAGE');
export const getPageTree = createAction(GET_PAGE_TREE, (...actions) => actions);
export const getPage = createAction(GET_PAGE, ({ pageSeq, callback }) => ({ pageSeq, callback }));
export const [GET_PAGE_LOOKUP_LIST, GET_PAGE_LOOKUP_LIST_SUCCESS, GET_PAGE_LOOKUP_LIST_FAILURE] = createRequestActionTypes('page/GET_PAGE_LOOKUP_LIST');
export const [GET_PAGE_LOOKUP, GET_PAGE_LOOKUP_SUCCESS, GET_PAGE_LOOKUP_FAILURE] = createRequestActionTypes('page/GET_PAGE_LOOKUP');
export const getPageLookupList = createAction(GET_PAGE_LOOKUP_LIST, (...actions) => actions);
export const getPageLookup = createAction(GET_PAGE_LOOKUP, ({ pageSeq, callback }) => ({ pageSeq, callback }));

/**
 * 모달 데이터(일시적인 데이터) 조회
 */
export const GET_PAGE_MODAL = 'page/GET_PAGE_MODAL';
export const GET_PAGE_LIST_MODAL = 'page/GET_PAGE_LIST_MODAL';
export const getPageModal = createAction(GET_PAGE_MODAL, ({ pageSeq, callback }) => ({ pageSeq, callback }));
export const getPageListModal = createAction(GET_PAGE_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

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
 * 트리에서 서브 페이지 추가
 */
export const INSERT_SUB_PAGE = 'page/INSERT_SUB_PAGE';
export const insertSubPage = createAction(INSERT_SUB_PAGE, ({ parent, latestDomainId }) => ({
    parent,
    latestDomainId,
}));

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
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'page/HAS_RELATION_LIST';

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

/**
 * 태그삽입
 */
export const APPEND_TAG = 'page/APPEND_TAG';
export const appendTag = createAction(APPEND_TAG, (inputTag) => inputTag);
