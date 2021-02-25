import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 * 기본 리스트 + 관련탭에서 사용하는 lookup 리스트
 */
export const CHANGE_SEARCH_OPTION = 'articlePage/CHANGE_SEARCH_OPTION';
export const CHANGE_LOOKUP_SEARCH_OPTION = 'articlePage/CHANGE_REF_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeLookupSearchOption = createAction(CHANGE_LOOKUP_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'articlePage/CLEAR_STORE';
export const CLEAR_ARTICLE_PAGE = 'articlePage/CLEAR_ARTICLE_PAGE';
export const CLEAR_ARTICLE_PAGE_LIST = 'articlePage/CLEAR_ARTICLE_PAGE_LIST';
export const CLEAR_SEARCH = 'articlePage/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'articlePage/CLEAR_RELATION_LIST';
export const CLEAR_HISTORY = 'articlePage/CLEAR_HISTORY';
export const CLEAR_LOOKUP = 'articlePage/CLEAR_LOOKUP';
export const clearStore = createAction(CLEAR_STORE);
export const clearArticlePage = createAction(CLEAR_ARTICLE_PAGE);
export const clearArticlePageList = createAction(CLEAR_ARTICLE_PAGE_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);
export const clearHistory = createAction(CLEAR_HISTORY);
export const clearLookup = createAction(CLEAR_LOOKUP);

/**
 * 데이터 조회
 */
export const [GET_ARTICLE_PAGE_LIST, GET_ARTICLE_PAGE_LIST_SUCCESS, GET_ARTICLE_PAGE_LIST_FAILURE] = createRequestActionTypes('articlePage/GET_ARTICLE_PAGE_LIST');
export const [GET_ARTICLE_PAGE, GET_ARTICLE_PAGE_SUCCESS, GET_ARTICLE_PAGE_FAILURE] = createRequestActionTypes('articlePage/GET_ARTICLE_PAGE');
export const getArticlePageList = createAction(GET_ARTICLE_PAGE_LIST, (...actions) => actions);
export const getArticlePage = createAction(GET_ARTICLE_PAGE, ({ artPageSeq, callback }) => ({ artPageSeq, callback }));
export const [GET_ARTICLE_PAGE_LOOKUP_LIST, GET_ARTICLE_PAGE_LOOKUP_LIST_SUCCESS, GET_ARTICLE_PAGE_LOOKUP_LIST_FAILURE] = createRequestActionTypes(
    'articlePage/GET_ARTICLE_PAGE_LOOKUP_LIST',
);
export const [GET_ARTICLE_PAGE_LOOKUP, GET_ARTICLE_PAGE_LOOKUP_SUCCESS, GET_ARTICLE_PAGE_LOOKUP_FAILURE] = createRequestActionTypes('articlePage/GET_ARTICLE_PAGE_LOOKUP');
export const getArticlePageLookupList = createAction(GET_ARTICLE_PAGE_LOOKUP_LIST, (...actions) => actions);
export const getArticlePageLookup = createAction(GET_ARTICLE_PAGE_LOOKUP, ({ artPageSeq, callback }) => ({ artPageSeq, callback }));

export const EXISTS_ARTICLE_TYPE = 'articlePage/EXISTS_ARTICLE_TYPE';
export const existsArtType = createAction(EXISTS_ARTICLE_TYPE, ({ domainId, artType, artPageSeq, callback }) => ({ domainId, artType, artPageSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_ARTICLE_PAGE_BODY = 'articlePage/CHANGE_ARTICLE_PAGE_BODY';
export const CHANGE_ARTICLE_PAGE = 'articlePage/CHANGE_ARTICLE_PAGE';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
export const changeArticlePageBody = createAction(CHANGE_ARTICLE_PAGE_BODY, (artPageBody) => artPageBody);
export const changeArticlePage = createAction(CHANGE_ARTICLE_PAGE, (articlePage) => articlePage);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_ARTICLE_PAGE = 'articlePage/SAVE_ARTICLE_PAGE';
export const saveArticlePage = createAction(SAVE_ARTICLE_PAGE, ({ actions, callback }) => ({ actions, callback }));

/**
 * 삭제
 */
export const [DELETE_ARTICLE_PAGE, DELETE_ARTICLE_PAGE_SUCCESS] = createRequestActionTypes('articlePage/DELETE_ARTICLE_PAGE');
export const deleteArticlePage = createAction(DELETE_ARTICLE_PAGE, ({ artPageSeq, callback }) => ({ artPageSeq, callback }));

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'articlePage/HAS_RELATION_LIST';

/**
 * 히스토리 검색조건 변경
 */
export const CHANGE_SEARCH_HIST_OPTION = 'articlePage/CHANGE_SEARCH_HIST_OPTION';
export const changeSearchHistOption = createAction(CHANGE_SEARCH_HIST_OPTION, (search) => search);

/**
 * 히스토리 데이터 조회
 */
export const [GET_HISTORY_LIST, GET_HISTORY_LIST_SUCCESS, GET_HISTORY_LIST_FAILURE] = createRequestActionTypes('articlePage/GET_HISTORY_LIST');
export const [GET_HISTORY, GET_HISTORY_SUCCESS, GET_HISTORY_FAILURE] = createRequestActionTypes('articlePage/GET_HISTORY');
export const getHistoryList = createAction(GET_HISTORY_LIST, (...actions) => actions);
export const getHistory = createAction(GET_HISTORY, ({ artPageSeq, histSeq }) => ({ artPageSeq, histSeq }));

/**
 * 태그삽입
 */
export const APPEND_TAG = 'articlePage/APPEND_TAG';
export const appendTag = createAction(APPEND_TAG, (inputTag) => inputTag);

export const [GET_PREVIEW_TOTAL_ID, GET_PREVIEW_TOTAL_ID_SUCCESS, GET_PREVIEW_TOTAL_ID_FAILURE] = createRequestActionTypes('articlePage/GET_PREVIEW_TOTAL_ID');
export const getPreviewTotalId = createAction(GET_PREVIEW_TOTAL_ID, ({ artType, callback }) => ({ artType, callback }));
