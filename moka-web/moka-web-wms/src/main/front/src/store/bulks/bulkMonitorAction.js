import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_BM_SEARCH_OPTION = 'bulkMonitor/CHANGE_BM_SEARCH_OPTION';
export const changeBmSearchOption = createAction(CHANGE_BM_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_BM_STORE = 'bulkMonitor/CLEAR_BM_STORE';
export const CLEAR_BM_LIST = 'bulkMonitor/CLEAR_BM_LIST';
export const CLEAR_BM_SEARCH = 'bulkMonitor/CLEAR_BM_SEARCH';
export const clearBmStore = createAction(CLEAR_BM_STORE);
export const clearBmList = createAction(CLEAR_BM_LIST);
export const clearBmSearch = createAction(CLEAR_BM_SEARCH);

// 벌크 모니터링 전체 건수 조회
export const [GET_BULK_STAT_TOTAL, GET_BULK_STAT_TOTAL_SUCCESS, GET_BULK_STAT_TOTAL_FAILURE] = createRequestActionTypes('bulkMonitor/GET_BULK_STAT_TOTAL');
export const getBulkStatTotal = createAction(GET_BULK_STAT_TOTAL, ({ date }) => ({ date }));

// 벌크 모니터링 전송 목록 조회
export const [GET_BULK_STAT_LIST, GET_BULK_STAT_LIST_SUCCESS, GET_BULK_STAT_LIST_FAILURE] = createRequestActionTypes('bulkMonitor/GET_BULK_STAT_LIST');
export const getBulkStatList = createAction(GET_BULK_STAT_LIST, (...actions) => actions);

// 벌크 모니터링 전체 테이블을 조회하는 액션
export const GET_BULK_MONITOR = 'bulkMonitor/GET_BULK_MONITOR';
export const getBulkMonitor = createAction(GET_BULK_MONITOR);

// 벌크 모니터링 전송 상세 정보 조회
export const [GET_BULK_STAT_LIST_INFO, GET_BULK_STAT_LIST_INFO_SUCCESS] = createRequestActionTypes('bulkMonitor/GET_BULK_STAT_LIST_INFO');
export const getBulkStatListInfo = createAction(GET_BULK_STAT_LIST_INFO, ({ search }) => ({ search }));
