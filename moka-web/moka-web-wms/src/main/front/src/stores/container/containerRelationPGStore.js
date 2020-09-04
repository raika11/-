import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as containerAPI from '../api/containerAPI';

/**
 * action
 */
export const CLEAR_RELATION_PAGE = 'containerRelationPGStore/CLEAR_RELATION_PAGE';
export const CHANGE_SEARCH_OPTION = ' containerRelationPGStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_PAGE_LIST,
    GET_RELATION_PAGE_LIST_SUCCESS,
    GET_RELATION_PAGE_LIST_FAILURE
] = createRequestActionTypes('containerRelationPGStore/GET_RELATION_PAGE_LIST');

/**
 * action creator
 */
export const clearRelationPage = createAction(CLEAR_RELATION_PAGE);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationPageList = createAction(GET_RELATION_PAGE_LIST, (search) => search);

/**
 * saga
 */
const getRelationPageListSaga = createListSaga(
    GET_RELATION_PAGE_LIST,
    containerAPI.getRelationList,
    CHANGE_SEARCH_OPTION,
    (state) => state.containerRelationPGStore
);

export function* containerRelationPGSaga() {
    yield takeLatest(GET_RELATION_PAGE_LIST, getRelationPageListSaga);
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
        relType: 'PG',
        relSeq: null,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'pageSeq,desc'
    }
};

/**
 * reducer
 */
const containerRelationPGStore = handleActions(
    {
        // clear
        [CLEAR_RELATION_PAGE]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_RELATION_PAGE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body && body.list;
                draft.total = body && body.totalCnt;
                draft.error = null;
            });
        },
        // 목록 조회 실패
        [GET_RELATION_PAGE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = null;
            });
        }
    },
    initialState
);

export default containerRelationPGStore;
