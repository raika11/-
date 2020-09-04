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
export const CLEAR_RELATION_COMPONENT = 'datasetRelationCPStore/CLEAR_RELATION_COMPONENT';
export const CHANGE_SEARCH_OPTION = ' datasetRelationCPStore/CHANGE_SEARCH_OPTION';
export const [
    GET_RELATION_COMPONENT_LIST,
    GET_RELATION_COMPONENT_LIST_SUCCESS,
    GET_RELATION_COMPONENT_LIST_FAILURE
] = createRequestActionTypes('datasetRelationCPStore/GET_RELATION_COMPONENT_LIST');

/**
 * action creator
 */
export const clearRelationComponent = createAction(CLEAR_RELATION_COMPONENT);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getRelationComponentList = createAction(
    GET_RELATION_COMPONENT_LIST,
    (search) => search
);

/**
 * saga
 */
const getRelationComponentListSaga = createListSaga(
    GET_RELATION_COMPONENT_LIST,
    datasetAPI.getRelationList,
    CHANGE_SEARCH_OPTION,
    (state) => state.datasetRelationCPStore
);

export function* datasetRelationCPSaga() {
    yield takeLatest(GET_RELATION_COMPONENT_LIST, getRelationComponentListSaga);
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
        relType: 'CP',
        relSeq: null,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'componentSeq,desc'
    }
};

/**
 * reducer
 */
const datasetRelationCPStore = handleActions(
    {
        // clear
        [CLEAR_RELATION_COMPONENT]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_RELATION_COMPONENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body && body.list;
                draft.total = body && body.totalCnt;
                draft.error = null;
            });
        },
        // 목록 조회 실패
        [GET_RELATION_COMPONENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = null;
            });
        }
    },
    initialState
);

export default datasetRelationCPStore;
