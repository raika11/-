import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as datasetAPI from '../api/datasetAPI';
import { POP_PAGESIZE_OPTIONS } from '~/constants';

/**
 * action
 */
const CLEAR_API = 'apiStore/CLEAR_API';
export const CHANGE_SEARCH_OPTION = 'apiStore/CHANGE_SEARCH_OPTION';
export const [GET_API_LIST, GET_API_LIST_SUCCESS, GET_API_LIST_FAILURE] = createRequestActionTypes(
    'apiStore/GET_API_LIST'
);

/**
 * action creator
 */
export const clearApi = createAction(CLEAR_API);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const getApiList = createAction(GET_API_LIST, (search) => search);

// saga
const getApiListSaga = createListSaga(
    GET_API_LIST,
    datasetAPI.getApiList,
    CHANGE_SEARCH_OPTION,
    (state) => state.apiStore
);

export function* apiSaga() {
    yield takeLatest(GET_API_LIST, getApiListSaga);
}

/**
 * init
 */
export const initialState = {
    list: null,
    error: null,
    total: 0,
    search: {
        apiCodeId: null,
        searchType: 'all',
        keyword: '',
        page: 0,
        size: POP_PAGESIZE_OPTIONS[0],
        sort: 'id,desc'
    },
    latestApi: null
};

/**
 * reducer
 */
const apiStore = handleActions(
    {
        // clear
        [CLEAR_API]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_API_LIST_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            list: body && body.list,
            total: body && body.totalCnt,
            error: null
        }),
        // 목록 조회 실패
        [GET_API_LIST_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error,
            list: null
        })
    },
    initialState
);

export default apiStore;
