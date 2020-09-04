import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as datasetAPI from '../api/datasetAPI';

/**
 * action
 */
const CLEAR_RELATION_CONTAINER = 'datasetRelationCTStore/CLEAR_RELATION_CONTAINER';
export const CHANGE_SEARCH_OPTION = ' datasetRelationCTStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_CONTAINER_LIST,
    GET_RELATION_CONTAINER_LIST_SUCCESS,
    GET_RELATION_CONTAINER_LIST_FAILURE
] = createRequestActionTypes('datasetRelationCTStore/GET_RELATION_CONTAINER_LIST');

/**
 * action creator
 */
export const clearRelationContainer = createAction(CLEAR_RELATION_CONTAINER);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationContainerList = createAction(
    GET_RELATION_CONTAINER_LIST,
    (search) => search
);

/**
 * saga
 */
const getRelationContainerListSaga = createListSaga(
    GET_RELATION_CONTAINER_LIST,
    datasetAPI.getRelationList,
    CHANGE_SEARCH_OPTION,
    (state) => state.datasetRelationCTStore
);

export function* datasetRelationCTSaga() {
    yield takeLatest(GET_RELATION_CONTAINER_LIST, getRelationContainerListSaga);
}

/**
 * init
 */
export const initialState = {
    list: null,
    error: null,
    total: 0,
    search: {
        domainId: 'all',
        relType: 'CT',
        relSeq: null,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'containerSeq,desc'
    }
};

/**
 * reducer
 */
const datasetRelationCTStore = handleActions(
    {
        // clear
        [CLEAR_RELATION_CONTAINER]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_RELATION_CONTAINER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body && body.list;
                draft.total = body && body.totalCnt;
                draft.error = null;
            });
        },
        // 목록 조회 실패
        [GET_RELATION_CONTAINER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = null;
            });
        }
    },
    initialState
);

export default datasetRelationCTStore;
