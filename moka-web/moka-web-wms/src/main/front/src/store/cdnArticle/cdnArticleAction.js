import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'cdnArticle/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ search }) => ({ search }));
export const CHANGE_INVALID_LIST = 'cdnArticle/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'cdnArticle/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_CDN_ARTICLE = 'cdnArticle/CLEAR_CDN_ARTICLE';
export const clearCdnArticle = createAction(CLEAR_CDN_ARTICLE);

/**
 * cdn 기사 목록 조회
 */
export const [GET_CDN_ARTICLE_LIST, GET_CDN_ARTICLE_LIST_SUCCESS, GET_CDN_ARTICLE_LIST_FAILURE] = createRequestActionTypes('cdnArticle/GET_CDN_ARTICLE_LIST');
export const getCdnArticleList = createAction(GET_CDN_ARTICLE_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * cdn 기사 조회
 */
export const [GET_CDN_ARTICLE, GET_CDN_ARTICLE_SUCCESS, GET_CDN_ARTICLE_FAILURE] = createRequestActionTypes('cdnArticle/GET_CDN_ARTICLE');
export const getCdnArticle = createAction(GET_CDN_ARTICLE, ({ totalId, callback }) => ({ totalId, callback }));

/**
 * cdn 기사 저장
 */
export const [SAVE_CDN_ARTICLE, SAVE_CDN_ARTICLE_SUCCESS, SAVE_CDN_ARTICLE_FAILURE] = createRequestActionTypes('cdnArticle/SAVE_CDN_ARTICLE');
export const saveCdnArticle = createAction(SAVE_CDN_ARTICLE, ({ cdnArticle, callback }) => ({ cdnArticle, callback }));

/**
 * cdn 기사 캐시 삭제
 */
export const CLEAR_CACHE = 'cdnArticle/CLEAR_CACHE';
export const clearCache = createAction(CLEAR_CACHE, ({ totalId, callback }) => ({ totalId, callback }));
