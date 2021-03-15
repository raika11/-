import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'article/CHANGE_SEARCH_OPTION';
export const CHANGE_SERVICE_SEARCH_OPTION = 'article/CHANGE_SERVICE_SEARCH_OPTION';
export const CHANGE_BULK_SEARCH_OPTION = 'article/CHANGE_BULK_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeServiceSearchOption = createAction(CHANGE_SERVICE_SEARCH_OPTION, (search) => search);
export const changeBulkSearchOption = createAction(CHANGE_BULK_SEARCH_OPTION, (search) => search);
export const CHANGE_INVALID_LIST = 'article/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'article/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_SERVICE_LIST = 'article/CLEAR_SERVICE_LIST';
export const CLEAR_BULK_LIST = 'article/CLEAR_BULK_LIST';
export const clearServiceList = createAction(CLEAR_SERVICE_LIST);
export const clearBulkList = createAction(CLEAR_BULK_LIST);
export const CLEAR_SEARCH = 'article/CLEAR_SEARCH';
export const CLEAR_SERVICE_SEARCH = 'article/CLEAR_SERVICE_SEARCH';
export const CLEAR_BULK_SEARCH = 'article/CLEAR_BULK_SEARCH';
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearServiceSearch = createAction(CLEAR_SERVICE_SEARCH);
export const clearBulkSearch = createAction(CLEAR_BULK_SEARCH);
export const CLEAR_ARTICLE = 'article/CLEAR_ARTICLE';
export const clearArticle = createAction(CLEAR_ARTICLE);
export const CLEAR_HISTORY = 'article/CLEAR_HISTORY';
export const clearHistory = createAction(CLEAR_HISTORY);

/**
 * 등록기사 리스트 조회 (기사만 조회)
 */
export const [GET_ARTICLE_LIST, GET_ARTICLE_LIST_SUCCESS, GET_ARTICLE_LIST_FAILURE] = createRequestActionTypes('article/GET_ARTICLE_LIST');
export const getArticleList = createAction(GET_ARTICLE_LIST, ({ type, search, getSourceList, callback }) => ({ search, callback }));

/**
 * 기사 조회 (Modal)
 * @param {array} props.type ['DESKING', 'JOONGANG', 'CONSALES', 'JSTORE', 'SOCIAL', 'BULK', 'RCV'] 데스킹 기사 (서비스 기사), 그 외
 *                           DESKING => 서비스 기사 조회, BULK => 벌크 기사 조회, 그외 매체 => 등록기사 조회
 * @param {bool} props.getSourceList true이면 매체 목록을 같이 조회하고 모든 매체 목록을 검색 조건에 포함함
 */
export const [GET_ARTICLE_LIST_MODAL, GET_ARTICLE_LIST_MODAL_SUCCESS, GET_ARTICLE_LIST_MODAL_FAILURE] = createRequestActionTypes('article/GET_ARTICLE_LIST_MODAL');
export const getArticleListModal = createAction(GET_ARTICLE_LIST_MODAL, ({ type, search, getSourceList, callback }) => ({ type, search, getSourceList, callback }));

/**
 * 등록기사 단건 조회
 */
export const [GET_ARTICLE, GET_ARTICLE_SUCCESS, GET_ARTICLE_FAILURE] = createRequestActionTypes('article/GET_ARTICLE');
export const getArticle = createAction(GET_ARTICLE, ({ totalId, callback }) => ({ totalId, callback }));

/**
 * 기사 편집제목 수정
 */
export const PUT_ARTICLE_EDIT_TITLE = 'article/PUT_ARTICLE_EDIT_TITLE';
export const putArticleEditTitle = createAction(PUT_ARTICLE_EDIT_TITLE, ({ totalId, artEditTitle, artEditMobTitle, callback }) => ({
    totalId,
    artEditTitle,
    artEditMobTitle,
    callback,
}));

/**
 * 기사 내 이미지 목록 조회
 */
export const [GET_ARTICLE_IMAGE_LIST, GET_ARTICLE_IMAGE_LIST_SUCCESS, GET_ARTICLE_IMAGE_LIST_FAILURE] = createRequestActionTypes('article/GET_ARTICLE_IMAGE_LIST');
export const getArticleImageList = createAction(GET_ARTICLE_IMAGE_LIST, ({ totalId }) => ({ totalId }));

/**
 * 등록기사 수정
 */
export const [SAVE_ARTICLE, SAVE_ARTICLE_SUCCESS, SAVE_ARTICLE_FAILURE] = createRequestActionTypes('article/SAVE_ARTICLE');
export const saveArticle = createAction(SAVE_ARTICLE, ({ article, callback }) => ({ article, callback }));

/**
 * 등록기사 삭제
 */
export const DELETE_ARTICLE = 'article/DELETE_ARTICLE';
export const deleteArticle = createAction(DELETE_ARTICLE, ({ totalId, callback }) => ({ totalId, callback }));

/**
 * 등록기사 중지
 */
export const STOP_ARTICLE = 'article/STOP_ARTICLE';
export const stopArticle = createAction(STOP_ARTICLE, ({ totalId, callback }) => ({ totalId, callback }));

/**
 * 등록기사 히스토리 조회
 */
export const [GET_ARTICLE_HISTORY_LIST, GET_ARTICLE_HISTORY_LIST_SUCCESS, GET_ARTICLE_HISTORY_LIST_FAILURE] = createRequestActionTypes('article/GET_ARTICLE_HISTORY_LIST');
export const getArticleHistoryList = createAction(GET_ARTICLE_HISTORY_LIST, ({ search, callback }) => ({ search, callback }));
