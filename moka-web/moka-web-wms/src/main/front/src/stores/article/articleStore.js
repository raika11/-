import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { PAGESIZE_OPTIONS, DB_DATE_FORMAT } from '~/constants';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'articleStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'articleStore/CHANGE_SEARCH_OPTIONS';
export const [GET_ARTICLES, GET_ARTICLES_SUCCESS, GET_ARTICLES_FAILURE] = createRequestActionTypes(
    'articleStore/GET_ARTICLES'
);
export const [GET_ARTICLE, GET_ARTICLE_SUCCESS, GET_ARTICLE_FAILURE] = createRequestActionTypes(
    'articleStore/GET_ARTICLE'
);

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const getArticles = createAction(GET_ARTICLES, (...payload) => payload);
export const getArticle = createAction(GET_ARTICLE, (payload) => payload);

const start = moment()
    .subtract(5, 'month')
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
        mediaId: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'distYmdt,desc',
        searchType: 'all',
        keyword: '',
        distStartYmdt: start.format(DB_DATE_FORMAT),
        distEndYmdt: end.format(DB_DATE_FORMAT),
        codeId: '',
        lang: '',
        serviceType: ''
    },
    error: {},
    articleData: {}
};

/**
 * reducer
 */
const articleStore = handleActions(
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
        },
        /**
         * 기사 조회
         */
        [GET_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.articleData = body;
            });
        }
    },
    initialState
);

export default articleStore;
