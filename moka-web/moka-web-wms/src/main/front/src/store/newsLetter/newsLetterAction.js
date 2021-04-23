import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 초기화
 */
export const CLEAR_STORE = 'newsLetter/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE, (payload) => payload);
export const CLEAR_NEWS_LETTER = 'newsLetter/CLEAR_NEWS_LETTER';
export const clearNewsLetter = createAction(CLEAR_NEWS_LETTER, (payload) => payload);

/**
 * 검색조건 변경
 */
export const CHANGE_NEWS_LETTER_SEARCH_OPTION = 'newsLetter/CHANGE_NEWS_LETTER_SEARCH_OPTION';
export const changeNewsLetterSearchOption = createAction(CHANGE_NEWS_LETTER_SEARCH_OPTION, (search) => search);

/**
 * 조회
 */
export const [GET_NEWS_LETTER_LIST, GET_NEWS_LETTER_LIST_SUCCESS, GET_NEWS_LETTER_LIST_FAILURE] = createRequestActionTypes('newsLetter/GET_NEWS_LETTER_LIST');
export const getNewsLetterList = createAction(GET_NEWS_LETTER_LIST, (...actions) => actions);
export const [GET_NEWS_LETTER, GET_NEWS_LETTER_SUCCESS, GET_NEWS_LETTER_FAILURE] = createRequestActionTypes('newsLetter/GET_NEWS_LETTER');
export const getNewsLetter = createAction(GET_NEWS_LETTER, (letterSeq) => letterSeq);
