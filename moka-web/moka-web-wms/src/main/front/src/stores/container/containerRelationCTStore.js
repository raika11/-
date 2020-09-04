import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { PAGESIZE_OPTIONS } from '~/constants';
import createRequestSaga, { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as containerAPI from '../api/containerAPI';

/**
 * action
 */
const CLEAR_RELATION_CONTAINER = 'containerRelationCTStore/CLEAR_RELATION_CONTAINER';
export const CHANGE_SEARCH_OPTION = 'containerRelationCTStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_CONTAINER_LIST,
    GET_RELATION_CONTAINER_LIST_SUCCESS,
    GET_RELATION_CONTAINER_LIST_FAILURE
] = createRequestActionTypes('containerRelationCTStore/GET_RELATION_CONTAINER_LIST');
export const [
    GET_RELATION_CONTAINER,
    GET_RELATION_CONTAINER_SUCCESS,
    GET_RELATION_CONTAINER_FAILURE
] = createRequestActionTypes('containerRelationCTStore/GET_RELATION_CONTAINER');

/**
 * action creator
 */
export const clearRelationContainer = createAction(CLEAR_RELATION_CONTAINER);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationContainerList = createAction(
    GET_RELATION_CONTAINER_LIST,
    (search) => search
);
export const getRelationContainer = createAction(
    GET_RELATION_CONTAINER,
    (containerSeq) => containerSeq
);

/**
 * saga
 */
const getRelationContainerListSaga = createListSaga(
    GET_RELATION_CONTAINER_LIST,
    containerAPI.getContainerList,
    CHANGE_SEARCH_OPTION,
    (state) => state.containerRelationCTStore
);

const getRelationContainerSaga = createRequestSaga(
    GET_RELATION_CONTAINER,
    containerAPI.getContainer
);

export function* containerRelationCTSaga() {
    yield takeLatest(GET_RELATION_CONTAINER_LIST, getRelationContainerListSaga);
    yield takeLatest(GET_RELATION_CONTAINER, getRelationContainerSaga);
}

/**
 * initialState
 */
export const initialState = {
    list: null,
    total: 0,
    error: null,
    search: {
        domainId: null,
        searchType: 'containerSeq',
        keyword: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'containerSeq,desc'
    },
    container: {},
    containerError: null
};

/**
 * reducer
 */
const containerRelationCTStore = handleActions(
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
        },
        // 상세 조회 성공
        [GET_RELATION_CONTAINER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.container = body;
                draft.containerError = null;
            });
        },
        // 상세 조회 실패
        [GET_RELATION_CONTAINER_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.containerError = payload;
            });
        }
    },
    initialState
);

export default containerRelationCTStore;
