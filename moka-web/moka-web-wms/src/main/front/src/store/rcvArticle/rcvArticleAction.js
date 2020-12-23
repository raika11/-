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

/**
 * 수신기사 목록 조회
 */
export const [GET_RCV_ARTICLE_LIST, GET_RCV_ARTICLE_LIST_SUCCESS, GET_RCV_ARTICLE_LIST_FAILURE] = createRequestActionTypes('rcvArticle/GET_RCV_ARTICLE_LIST');
export const getRcvArticleList = createAction(GET_RCV_ARTICLE_LIST, ({ search, callback }) => ({ search, callback }));
