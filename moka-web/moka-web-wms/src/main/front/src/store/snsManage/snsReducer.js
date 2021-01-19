import { DB_DATEFORMAT, PAGESIZE_OPTIONS } from '@/constants';
import { handleActions } from 'redux-actions';
import * as action from '@store/snsManage/snsAction';
import produce from 'immer';
import moment from 'moment';

export const initialState = {
    meta: {
        list: [],
        meta: {
            totalId: '',
            fb: {
                usedYn: false,
                title: '',
                summary: '',
                postMessage: '',
                imgUrl: '',
                isReserve: false,
                reserveDt: null,
            },
            tw: {
                usedYn: false,
                title: '',
                summary: '',
                postMessage: '',
                imgUrl: '',
                isReserve: false,
                reserveDt: null,
            },
            article: {
                serviceFlag: false,
                title: '',
                summary: '',
                imgUrl: '',
                regDt: null,
            },
        },
        total: 0,
        search: {
            startDt: moment(new Date(2020, 7, 21, 0, 0, 0)).format(DB_DATEFORMAT),
            endDt: moment(new Date(2020, 7, 21, 23, 59, 59)).format(DB_DATEFORMAT),
            searchType: 'artTitle',
            keyword: '',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            //sort: 'startDt,desc',
        },
    },
    sendArticle: {
        article: {
            totalId: '',
            snsInsDt: null,
            imgUrl: '',
            orgTitle: '',
            orgSummary: '',
            title: '',
            summary: '',
            useYn: 'N',
        },
        list: [],
        total: 0,
        search: {
            searchType: 'artTitle',
            keyword: '',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
        },
    },
};

export default handleActions(
    {
        [action.CLEAR_META_STORE]: (state) => {
            return produce(state, (draft) => {
                draft.meta = initialState.meta;
            });
        },
        [action.CLEAR_SNS_META]: (state) => {
            return produce(state, (draft) => {
                draft.meta.meta = initialState.meta.meta;
            });
        },
        [action.CLEAR_SNS_META_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.meta.list = initialState.meta.list;
                draft.meta.total = initialState.meta.total;
            });
        },
        [action.GET_SNS_META_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.meta.list = body.list;
                draft.meta.total = body.totalCnt;
            });
        },
        [action.CHANGE_SNS_META_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.meta.search = payload;
            });
        },
        [action.GET_SNS_META_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.meta.meta = payload;
            });
        },
        [action.GET_SNS_META_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.meta.meta = initialState.meta.meta;
                draft.meta.errors = payload;
            });
        },

        /**************** ************/
        [action.GET_SNS_SEND_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.sendArticle.list = body.list;
                draft.sendArticle.total = body.totalCnt;
            });
        },
        [action.CHANGE_SNS_SEND_ARTICLE_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.sendArticle.search = payload;
            });
        },
    },

    initialState,
);
