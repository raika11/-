import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색 조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'mic/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'mic/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
// export const CLEAR_RCV_ARTICLE = 'mic/CLEAR_RCV_ARTICLE';
// export const clearRcvArticle = createAction(CLEAR_RCV_ARTICLE);

/**
 * 아젠다 목록 조회
 */
export const [GET_MIC_AGENDA_LIST, GET_MIC_AGENDA_LIST_SUCCESS, GET_MIC_AGENDA_LIST_FAILURE] = createRequestActionTypes('mic/GET_MIC_AGENDA_LIST');
export const getMicAgendaList = createAction(GET_MIC_AGENDA_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 아젠다 목록 조회 (모달)
 */
export const GET_MIC_AGENDA_LIST_MODAL = 'mic/GET_MIC_AGENDA_LIST_MODAL';
export const getMicAgendaListModal = createAction(GET_MIC_AGENDA_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 아젠다 순서 변경
 */
export const PUT_MIC_AGENDA_SORT = 'mic/PUT_MIC_AGENDA_SORT';
export const putMicAgendaSort = createAction(PUT_MIC_AGENDA_SORT, ({ sortedList, callback }) => ({ sortedList, callback }));

/**
 * 아젠다, 전체 포스트 수 조회
 */
export const [GET_MIC_REPORT, GET_MIC_REPORT_SUCCESS] = createRequestActionTypes('mic/GET_MIC_REPORT');
export const getMicReport = createAction(GET_MIC_REPORT);
