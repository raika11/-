import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'article/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'article/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_LIST = 'article/CLEAR_LIST';
export const clearList = createAction(CLEAR_LIST);
export const CLEAR_SEARCH = 'article/CLEAR_SEARCH';
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_ARTICLE_LIST, GET_ARTICLE_LIST_SUCCESS, GET_ARTICLE_LIST_FAILURE] = createRequestActionTypes('article/GET_ARTICLE_LIST');
export const getArticleList = createAction(GET_ARTICLE_LIST, (...actions) => actions);

/**
 * 기사 편집제목 수정
 */
export const PUT_ARTICLE_EDIT_TITLE = 'article/PUT_ARTICLE_EDIT_TITLE';
export const putArticleEditTitle = createAction(PUT_ARTICLE_EDIT_TITLE, ({ totalId, title, mobTitle }) => ({ totalId, title, mobTitle }));
