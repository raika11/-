import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as pageAPI from '~/stores/api/pageAPI';

/**
 * action
 */
export const CLEAR_HISTORY = 'pageHistoryStore/CLEAN_HISTORY';
export const CHANGE_SEARCH_OPTION = 'pageHistoryStore/CHANGE_SEARCH_OPTION';
export const [
    GET_HISTORY_LIST,
    GET_HISTORY_LIST_SUCCESS,
    GET_HISTORY_LIST_FAILURE
] = createRequestActionTypes('pageHistoryStore/GET_HISTORY_LIST');

/**
 * action creator
 */
export const clearHistory = createAction(CLEAR_HISTORY);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getHistoryList = createAction(GET_HISTORY_LIST, (search) => search);

/**
 * saga
 */
export const getHistoryListSaga = createListSaga(
    GET_HISTORY_LIST,
    pageAPI.getHistoryList,
    CHANGE_SEARCH_OPTION,
    (state) => state.pageHistoryStore
);

export function* pageHistorySaga() {
    yield takeLatest(GET_HISTORY_LIST, getHistoryListSaga);
}

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    search: {
        seq: null,
        searchType: 'all',
        keyword: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'createYmdt,desc'
    },
    list: null
};

/**
 * reducer
 */
const pageHistoryStore = handleActions(
    {
        // clear
        [CLEAR_HISTORY]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body && body.list;
                draft.total = body && body.totalCnt;
                draft.error = null;
            });
        },
        // 목록 조회 실패
        [GET_HISTORY_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = null;
            });
        }
    },
    initialState
);

export default pageHistoryStore;
