import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색 조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'rcvArticle/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'rcvArticle/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_RCV_ARTICLE = 'rcvArticle/CLEAR_RCV_ARTICLE';
export const clearRcvArticle = createAction(CLEAR_RCV_ARTICLE);

/**
 * 수신기사 목록 조회
 */
export const [GET_RCV_ARTICLE_LIST, GET_RCV_ARTICLE_LIST_SUCCESS, GET_RCV_ARTICLE_LIST_FAILURE] = createRequestActionTypes('rcvArticle/GET_RCV_ARTICLE_LIST');
export const getRcvArticleList = createAction(GET_RCV_ARTICLE_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 수신기사 조회
 */
export const [GET_RCV_ARTICLE, GET_RCV_ARTICLE_SUCCESS] = createRequestActionTypes('rcvArticle/GET_RCV_ARTICLE');
export const getRcvArticle = createAction(GET_RCV_ARTICLE, ({ rid, callback }) => ({ rid, callback }));

/**
 * 수신기사 조회(모달)
 */
export const GET_RCV_ARTICLE_MODAL = 'rcvArticle/GET_RCV_ARTICLE_MODAL';
export const getRcvArticleModal = createAction(GET_RCV_ARTICLE_MODAL, ({ rid, callback }) => ({ rid, callback }));
