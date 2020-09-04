import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { PAGESIZE_OPTIONS, DB_DATE_FORMAT } from '~/constants';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'relationArticleStore/CHANGE_SEARCH_OPTION';
export const CHANGE_HELPER_TEXT = 'relationArticleStore/CHANGE_HELPER_TEXT';
export const CLEAR_ALL = 'relationArticleStore/CLEAR_ALL';
export const [GET_ARTICLES, GET_ARTICLES_SUCCESS, GET_ARTICLES_FAILURE] = createRequestActionTypes(
    'relationArticleStore/GET_ARTICLES'
);

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const changeHelperText = createAction(CHANGE_HELPER_TEXT, (payload) => payload);
export const getArticles = createAction(GET_ARTICLES, (...payload) => payload);
export const clearAll = createAction(CLEAR_ALL);

const start = moment()
    .subtract(3, 'month')
    .subtract(3, 'days')
    .set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
const end = moment().set({ hour: 0, minute: 0, second: 0, milisecond: 0 });

/**
 * initial State
 */
const initialState = {
    total: 0,
    list: [],
    search: {
        mediaId: undefined,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'distYmdt,desc',
        searchType: 'all',
        keyword: '',
        distStartYmdt: start.format(DB_DATE_FORMAT),
        distEndYmdt: end.format(DB_DATE_FORMAT),
        searchCodeId: undefined
    },
    error: undefined,
    helperText: ''
};

/**
 * reducer
 */
const relationArticleStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CHANGE_HELPER_TEXT]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.helperText = payload;
            });
        },
        [CLEAR_ALL]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
                draft.list = initialState.list;
                draft.error = initialState.error;
                draft.total = initialState.total;
            });
        },
        /**
         * 목록
         */
        [GET_ARTICLES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_ARTICLES_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        }
    },
    initialState
);

export default relationArticleStore;
