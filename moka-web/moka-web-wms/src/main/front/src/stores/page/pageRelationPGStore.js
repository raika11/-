import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import { PAGESIZE_OPTIONS } from '~/constants';
import createRequestSaga, { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import createListSaga from '~/stores/@common/createListSaga';
import * as pageAPI from '../api/pageAPI';

/**
 * action
 */
export const CLEAR_RELATION_PAGE = 'pageRelationPGStore/CLEAR_RELATION_PAGE';
export const CHANGE_SEARCH_OPTION = 'pageRelationPGStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_PAGE_LIST,
    GET_RELATION_PAGE_LIST_SUCCESS,
    GET_RELATION_PAGE_LIST_FAILURE
] = createRequestActionTypes('pageRelationPGStore/GET_RELATION_LIST');
export const [
    GET_RELATION_PAGE,
    GET_RELATION_PAGE_SUCCESS,
    GET_RELATION_PAGE_FAILURE
] = createRequestActionTypes('pageRelationPGStore/GET_RELATION_PAGE');

/**
 * action creator
 */
export const clearRelationPage = createAction(CLEAR_RELATION_PAGE);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationPageList = createAction(GET_RELATION_PAGE_LIST, (search) => search);
export const getRelationPage = createAction(GET_RELATION_PAGE, (pageSeq) => pageSeq);

/**
 * saga
 */
const getRelationPageListSaga = createListSaga(
    GET_RELATION_PAGE_LIST,
    pageAPI.getPageList,
    CHANGE_SEARCH_OPTION,
    (state) => state.pageRelationPGStore
);

const getRelationPageSaga = createRequestSaga(GET_RELATION_PAGE, pageAPI.getPage);

export function* pageRelationPGSaga() {
    yield takeLatest(GET_RELATION_PAGE_LIST, getRelationPageListSaga);
    yield takeLatest(GET_RELATION_PAGE, getRelationPageSaga);
}

/**
 * init
 */
export const initialState = {
    list: null,
    total: 0,
    error: null,
    search: {
        domainId: null,
        searchType: 'pageSeq',
        keyword: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'pageSeq,desc'
    },
    page: {},
    pageError: null
};

/**
 * reducer
 */
const pageRelationPGStore = handleActions(
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
        },
        // 상세 조회 성공
        [GET_RELATION_PAGE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.page = body;
                draft.pageError = null;
            });
        },
        // 상세 조회 실패
        [GET_RELATION_PAGE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.pageError = payload;
            });
        }
    },
    initialState
);

export default pageRelationPGStore;
