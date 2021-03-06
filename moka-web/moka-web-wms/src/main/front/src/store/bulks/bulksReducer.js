import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    INITIALIZED_PARAMS,
    CLEAR_STORE,
    CLEAR_BULKS_LIST,
    GET_BULK_LIST_SUCCESS,
    GET_BULK_LIST_FAILURE,
    SHOW_PREVIEW_MODAL,
    HIDE_PREVIEW_MODAL,
    GET_BULK_ARTICLE_SUCCESS,
    GET_BULK_ARTICLE_FAILURE,
    GET_SPECIALCHAR_SUCCESS,
    GET_SPECIALCHAR_FAILURE,
    CHANGE_SEARCH_OPTION,
    GET_COPYRIGHT_SUCCESS,
    GET_COPYRIGHT_FAILURE,
    CLEAR_BULKS_ARTICLE,
    GET_HOTCLICK_TITLE_SUCCESS,
    CHANGE_HOTCLICK_LIST,
    CLEAR_HOTCLICK_HISTORYLIST,
    GET_HOTCLICK_HISTORY_LIST_SUCCESS,
    CHANGE_HISTORY_SEARCH_OPTION,
    GET_HISTORY_DETAIL_SUCCESS,
    CLEAR_HISTORY_DETAIL,
    GET_HOTCLICK_LIST_SUCCESS,
    CLEAR_HOTCLICK_LIST,
    CHANGE_HOT_CLICK_LIST_ITEM,
} from './bulksAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    bulkPathName: '',
    bulkartDiv: '',
    sourceCode: '',
    bulkn: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            bulkartDiv: '',
            sourceCode: '',
            startDt: '',
            endDt: '',
        },
        bulkartSeq: null,
        bulkArticle: {
            list: [],
            bulk: {},
        },
        bulksError: null,
        invalidList: [],
        previewModal: {
            state: false,
            activeKey: 0,
            bulkArticle: null,
        },
        specialchar: {
            grpCd: '',
            dtlCd: '',
            cdNm: '',
            seqNo: null,
        },
        copyright: {
            grpCd: '',
            dtlCd: '',
            cdNm: '',
            seqNo: null,
        },
    },
    bulkh: {
        topTitle: {
            send: {},
            wait: {},
        },
        bulkartSeq: 0,
        hotclickList: {
            total: 0,
            list: [],
        },
        historyList: {
            totalCnt: 0,
            list: [],
            search: {
                page: 0,
                size: 20,
                bulkartDiv: '',
                sourceCode: '',
                status: 'publish',
            },
            article: {
                totalCnt: 0,
                selectSeq: 0,
                list: [],
            },
        },
    },
};

export default handleActions(
    {
        // ?????? ?????????.
        [CLEAR_STORE]: () => initialState,
        // ????????? ?????? ?????????.
        [INITIALIZED_PARAMS]: (state, { payload: { bulk_div, bulk_source, bulkPathName } }) => {
            return produce(state, (draft) => {
                draft.bulkPathName = bulkPathName;
                draft.bulkartDiv = bulk_div;
                draft.sourceCode = bulk_source;
                draft.bulkn.search.bulkartDiv = bulk_div;
                draft.bulkn.search.sourceCode = bulk_source;
                draft.bulkh.historyList.search.bulkartDiv = bulk_div;
                draft.bulkh.historyList.search.sourceCode = bulk_source;
            });
        },
        // ????????? ?????????.
        [CLEAR_BULKS_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkn.list = initialState.bulkn.list;
                draft.bulkn.bulksError = initialState.bulkn.bulksError;
                draft.bulkn.invalidList = initialState.bulkn.invalidList;
            });
        },
        [CLEAR_BULKS_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.bulkn.bulkartSeq = initialState.bulkn.bulkartSeq;
                draft.bulkn.bulkArticle = initialState.bulkn.bulkArticle;
            });
        },
        // ????????? ?????? ??????.
        [GET_BULK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.list = body.list;
                draft.bulkn.total = body.totalCnt;
            });
        },
        // ????????? ?????? ??????.
        [GET_BULK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.list = initialState.bulkn.list;
                draft.bulkn.total = initialState.bulkn.total;
            });
        },
        // ?????? ????????? ?????? ??????.
        [GET_SPECIALCHAR_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.specialchar = body;
            });
        },
        // ?????? ????????? ?????? ??????.
        [GET_SPECIALCHAR_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.specialchar = initialState.bulkn.specialchar;
            });
        },
        // Copyright ????????? ?????? ??????.
        [GET_COPYRIGHT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.copyright = body;
            });
        },
        // Copyright ????????? ?????? ??????.
        [GET_COPYRIGHT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.copyright = initialState.bulkn.copyright;
            });
        },

        // ?????? ?????? ?????? ?????? ??? ?????????(??????????????? ?????? ?????? ?????????).
        [SHOW_PREVIEW_MODAL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.previewModal.state = payload.state;
                draft.bulkn.previewModal.activeKey = payload.activeKey;
                draft.bulkn.previewModal.bulkArticle = payload.bulkArticle;
            });
        },
        // ???????????? ????????? ?????? ?????????.
        [HIDE_PREVIEW_MODAL]: (state) => {
            return produce(state, (draft) => {
                draft.bulkn.previewModal.state = false;
                draft.bulkn.previewModal.bulkArticle = null;
            });
        },
        // ?????? ?????? ?????? ????????? ?????? ??????.
        [GET_BULK_ARTICLE_SUCCESS]: (state, { payload: { list, bulk } }) => {
            return produce(state, (draft) => {
                draft.bulkn.bulkartSeq = bulk.bulkartSeq;
                draft.bulkn.bulkArticle.list = list;
                draft.bulkn.bulkArticle.bulk = bulk;
                draft.bulkn.bulksError = initialState.bulkn.bulksError;
            });
        },
        // ?????? ?????? ?????? ????????? ?????? ??????.
        [GET_BULK_ARTICLE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.bulksError = payload;
            });
        },
        // ?????? ?????? ??????.
        [CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.search = payload;
            });
        },

        // ????????? ?????????.
        // ????????? ?????? ?????????.
        [GET_HOTCLICK_TITLE_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.topTitle.send = payload.send ? payload.send : initialState.bulkh.topTitle.send;
                draft.bulkh.topTitle.wait = payload.wait ? payload.wait : initialState.bulkh.topTitle.wait;
            });
        },
        // ????????? ????????? ?????????.
        [CLEAR_HOTCLICK_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList = initialState.bulkh.hotclickList;
            });
        },
        // ????????? ????????? ?????? ??????. ( ??????,??????, ??????.)
        [CHANGE_HOTCLICK_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList.list = payload;
            });
        },

        [CHANGE_HOT_CLICK_LIST_ITEM]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList.list[payload.itemIndex] = payload;
            });
        },

        // ????????? ???????????? ?????????.
        [CLEAR_HOTCLICK_HISTORYLIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.totalCnt = initialState.bulkh.historyList.totalCnt;
                draft.bulkh.historyList.list = initialState.bulkh.historyList.list;
                draft.bulkh.historyList.article = initialState.bulkh.historyList.article;
                draft.bulkh.historyList.search.page = initialState.bulkh.historyList.search.page;
                draft.bulkh.historyList.search.size = initialState.bulkh.historyList.search.size;
            });
        },

        // ????????? ???????????? ????????? ??????.
        [GET_HOTCLICK_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.totalCnt = body.totalCnt;
                draft.bulkh.historyList.list = body.list;
            });
        },
        // ???????????? ??????????????? ??????????????? ?????? ????????? ??????.( ?????????)
        [CHANGE_HISTORY_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.search = payload;
            });
        },
        // ???????????? ??????
        [GET_HISTORY_DETAIL_SUCCESS]: (state, { payload: { bulkartSeq, body } }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.article.totalCnt = body.totalCnt;
                draft.bulkh.historyList.article.list = body.LIST.list;
                draft.bulkh.historyList.article.selectSeq = bulkartSeq;
            });
        },
        // ????????? ???????????? ?????? ?????????.
        [CLEAR_HISTORY_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.article = initialState.bulkh.historyList.article;
            });
        },
        // ????????? ????????? ????????? ??????.
        [GET_HOTCLICK_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList.totalCnt = payload.totalCnt;
                draft.bulkh.hotclickList.list = payload.LIST.list;
            });
        },
    },
    initialState,
);
