import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_STAT_SEARCH_OPTION = 'searchKeyword/CHANGE_STAT_SEARCH_OPTION';
export const changeStatSearchOption = createAction(CHANGE_STAT_SEARCH_OPTION, (search) => search);
export const CHANGE_DETAIL_SEARCH_OPTION = 'searchKeyword/CHANGE_DETAIL_SEARCH_OPTION';
export const changeDetailSearchOption = createAction(CHANGE_DETAIL_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'searchKeyword/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_STAT_DETAIL = 'searchKeyword/CLEAR_STAT_DETAIL';
export const clearStatDetail = createAction(CLEAR_STAT_DETAIL);

/**
 * 키워드 통계 조회
 */
export const [GET_SEARCH_KEYWORD_STAT, GET_SEARCH_KEYWORD_STAT_SUCCESS, GET_SEARCH_KEYWORD_STAT_FAILURE] = createRequestActionTypes('searchKeyword/GET_SEARCH_KEYWORD_STAT');
export const getSearchKeywordStat = createAction(GET_SEARCH_KEYWORD_STAT, ({ search, callback }) => ({ search, callback }));

/**
 * 키워드 엑셀 다운
 */
export const DOWNLOAD_EXCEL = 'searchKeyword/DOWNLOAD_EXCEL';
export const downloadExcel = createAction(DOWNLOAD_EXCEL, ({ search }) => ({ search }));
