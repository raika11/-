import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { getSkinsSaga } from './skinSaga';

/**
 * action
 */
const CHANGE_SEARCH_OPTION = 'skinStore/CHANGE_SEARCH_OPTION';
const CHANGE_SEARCH_OPTIONS = 'skinStore/CHANGE_SEARCH_OPTIONS';
const CLEAR_SEARCH_OPTION = 'skinStore/CLEAR_SEARCH_OPTION';
const [GET_SKINS, GET_SKINS_SUCCESS, GET_SKINS_FAILURE] = createRequestActionTypes(
    'skinStore/GET_SKINS'
);

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const getSkins = createAction(GET_SKINS, (...actions) => actions);

/**
 * saga
 */
export function* skinSaga() {
    yield takeLatest(GET_SKINS, getSkinsSaga);
}

/**
 * initialState
 */
const initialState = {
    total: 0,
    error: undefined,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        domainId: undefined,
        serviceType: undefined,
        sort: 'skinSeq,desc',
        searchType: 'all',
        keyword: ''
    },
    detail: {},
    detailError: undefined,
    edit: {}
};

/**
 * reducer
 */
const skinStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CHANGE_SEARCH_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.search[obj.key] = obj.value;
                }
            });
        },
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 목록
         */
        [GET_SKINS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_SKINS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        }
    },
    initialState
);

export default skinStore;
