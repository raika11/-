import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'articleCdn/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ search }) => ({ search }));

/**
 * cdn 등록 기사 조회
 */
export const [GET_ARTICLE_CDN_LIST, GET_ARTICLE_CDN_LIST_SUCCESS, GET_ARTICLE_CDN_LIST_FAILURE] = createRequestActionTypes('articleCdn/GET_ARTICLE_CDN_LIST');
export const getArticleCdnList = createAction(GET_ARTICLE_CDN_LIST, ({ search, callback }) => ({ search, callback }));
