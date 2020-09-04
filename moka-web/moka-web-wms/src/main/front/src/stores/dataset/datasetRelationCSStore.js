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
export const CLEAR_RELATION_SKIN = 'datasetRelationCSStore/CLEAR_RELATION_SKIN';
export const CHANGE_SEARCH_OPTION = 'datasetRelationCSStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_SKIN_LIST,
    GET_RELATION_SKIN_LIST_SUCCESS,
    GET_RELATION_SKIN_LIST_FAILURE
] = createRequestActionTypes('datasetRelationCSStore/GET_RELATION_SKIN_LIST');

/**
 * action creator
 */
export const clearRelationSkin = createAction(CLEAR_RELATION_SKIN);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationSkinList = createAction(GET_RELATION_SKIN_LIST, (search) => search);

/**
 * saga
 */
const getRelationSkinListSaga = createListSaga(
    GET_RELATION_SKIN_LIST,
    datasetAPI.getRelationList,
    CHANGE_SEARCH_OPTION,
    (state) => state.datasetRelationCSStore
);

export function* datasetRelationCSSaga() {
    yield takeLatest(GET_RELATION_SKIN_LIST, getRelationSkinListSaga);
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
        relType: 'CS',
        relSeq: null,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'skinSeq,desc'
    }
};

/**
 * reducer
 */
const datasetRelationCSStore = handleActions(
    {
        // clear
        [CLEAR_RELATION_SKIN]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_RELATION_SKIN_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = null;
            });
        },
        // 목록 조회 실패
        [GET_RELATION_SKIN_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = null;
            });
        }
    },
    initialState
);

export default datasetRelationCSStore;
