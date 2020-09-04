import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'templateHistoryStore/CHANGE_SEARCH_OPTION';
export const CLEAR_HISTORIES = 'templateHistoryStore/CLEAR_HISTORIES';
export const [
    GET_HISTORIES,
    GET_HISTORIES_SUCCESS,
    GET_HISTORIES_FAILURE
] = createRequestActionTypes('templateHistoryStore/GET_HISTORIES');

/**
 * action creator
 */
export const getHistories = createAction(GET_HISTORIES, (payload) => payload);
export const clearHistories = createAction(CLEAR_HISTORIES);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));

/**
 * initialState
 */
const initialState = {
    total: 0,
    error: undefined,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'createDt,desc',
        templateSeq: undefined,
        searchType: 'all',
        keyword: ''
    },
    list: []
};

/**
 * reducer
 */
const templateHistoryStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [GET_HISTORIES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_HISTORIES_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        [CLEAR_HISTORIES]: (state) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        }
    },
    initialState
);

export default templateHistoryStore;
