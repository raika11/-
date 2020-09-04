import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { POP_PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as datasetAPI from '~/stores/api/datasetAPI';

/**
 * action
 */
const CLEAR_AUTO_DATASET = 'datasetAutoStore/CLEAR_AUTO_DATASET';
export const CHANGE_SEARCH_OPTION = 'datasetAutoStore/CHANGE_SEARCH_OPTION';
export const [
    GET_DATASET_LIST,
    GET_DATASET_LIST_SUCCESS,
    GET_DATASET_LIST_FAILURE
] = createRequestActionTypes('datasetAutoStore/GET_DATASET_LIST');

/**
 * action creator
 */
export const clearAutoDataset = createAction(CLEAR_AUTO_DATASET);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getDatasetList = createAction(GET_DATASET_LIST, (search) => search);

/**
 * saga
 */
const getDatasetListSaga = createListSaga(
    GET_DATASET_LIST,
    datasetAPI.getDatasetList,
    CHANGE_SEARCH_OPTION,
    (state) => state.datasetAutoStore
);

export function* datasetAutoSaga() {
    yield takeLatest(GET_DATASET_LIST, getDatasetListSaga);
}

/**
 * init
 */
// 자동완성 검색조건
export const defaultSearch = {
    apiCodeId: null,
    searchType: 'datasetSeqLike',
    keyword: '',
    page: 0,
    size: 999,
    sort: 'datasetSeq,desc',
    listType: 'auto'
};

// 팝업 검색조건
export const defaultPopSearch = {
    apiCodeId: null,
    searchType: 'all',
    keyword: '',
    page: 0,
    size: POP_PAGESIZE_OPTIONS[0],
    sort: 'datasetSeq,desc',
    listType: 'popup'
};

const initialState = {
    list: [],
    error: null,
    total: 0,
    search: defaultSearch
};

/**
 * reducer
 */
const datasetAutoStore = handleActions(
    {
        // clear
        [CLEAR_AUTO_DATASET]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_DATASET_LIST_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            list: body && body.list,
            total: body && body.totalCnt,
            error: null
        }),
        // 목록 조회 실패
        [GET_DATASET_LIST_FAILURE]: (state, { payload: error }) => ({
            ...state,
            list: [],
            error
        })
    },
    initialState
);

export default datasetAutoStore;
