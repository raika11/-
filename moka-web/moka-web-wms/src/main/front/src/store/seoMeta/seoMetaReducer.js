import { DB_DATEFORMAT, PAGESIZE_OPTIONS } from '@/constants';
import moment from 'moment';
import { handleActions } from 'redux-actions';
import * as actions from './seoMetaAction';
import produce from 'immer';

export const initialState = {
    total: 0,
    list: [],
    seoMeta: {
        usedYn: 'N',
        title: '',
        summary: '',
        keyword: '',
        addKeyword: '',
    },
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        startDt: moment(new Date(2020, 7, 21, 0, 0, 0)).format(DB_DATEFORMAT),
        endDt: moment(new Date(2020, 7, 21, 23, 59, 59)).format(DB_DATEFORMAT),
        searchType: 'artTitle',
        keyword: '',
    },
    error: null,
};

export default handleActions(
    {
        [actions.CLEAR_STORE]: () => initialState,

        [actions.CLEAR_SEO_META]: (state) => {
            return produce(state, (draft) => {
                draft.seoMeta = initialState.seoMeta;
            });
        },

        [actions.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
            });
        },

        [actions.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },

        [actions.CHANGE_SEARCH_OPTIONS]: (state, payload) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
    },
    initialState,
);
