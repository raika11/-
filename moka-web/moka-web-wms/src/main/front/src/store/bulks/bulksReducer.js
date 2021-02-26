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
        // 전체 초기화.
        [CLEAR_STORE]: () => initialState,
        // 구분값 제외 초기화.
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
        // 리스트 초기화.
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
        // 리스트 조회 성공.
        [GET_BULK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.list = body.list;
                draft.bulkn.total = body.totalCnt;
            });
        },
        // 리스트 조회 에러.
        [GET_BULK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.list = initialState.bulkn.list;
                draft.bulkn.total = initialState.bulkn.total;
            });
        },
        // 약물 가지고 오기 성공.
        [GET_SPECIALCHAR_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.specialchar = body;
            });
        },
        // 약물 가지고 오기 에러.
        [GET_SPECIALCHAR_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.specialchar = initialState.bulkn.specialchar;
            });
        },
        // Copyright 가지고 오기 성공.
        [GET_COPYRIGHT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = initialState.bulkn.error;
                draft.bulkn.copyright = body;
            });
        },
        // Copyright 가지고 오기 에러.
        [GET_COPYRIGHT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.error = payload;
                draft.bulkn.copyright = initialState.bulkn.copyright;
            });
        },

        // 미리 보기 모달 상태 및 데이터(미리보기에 쓰일 기사 리스트).
        [SHOW_PREVIEW_MODAL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.previewModal.state = payload.state;
                draft.bulkn.previewModal.activeKey = payload.activeKey;
                draft.bulkn.previewModal.bulkArticle = payload.bulkArticle;
            });
        },
        // 미리보기 모달창 닫기 이벤트.
        [HIDE_PREVIEW_MODAL]: (state) => {
            return produce(state, (draft) => {
                draft.bulkn.previewModal.state = false;
                draft.bulkn.previewModal.bulkArticle = null;
            });
        },
        // 문구 상세 정보 가기고 오기 성공.
        [GET_BULK_ARTICLE_SUCCESS]: (state, { payload: { list, bulk } }) => {
            return produce(state, (draft) => {
                draft.bulkn.bulkartSeq = bulk.bulkartSeq;
                draft.bulkn.bulkArticle.list = list;
                draft.bulkn.bulkArticle.bulk = bulk;
                draft.bulkn.bulksError = initialState.bulkn.bulksError;
            });
        },
        // 문구 상세 정보 가기고 오기 실패.
        [GET_BULK_ARTICLE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.bulksError = payload;
            });
        },
        // 검색 옵션 처리.
        [CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkn.search = payload;
            });
        },

        // 아티클 핫클릭.
        // 핫클릭 상단 타이틀.
        [GET_HOTCLICK_TITLE_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.topTitle.send = payload.send ? payload.send : initialState.bulkh.topTitle.send;
                draft.bulkh.topTitle.wait = payload.wait ? payload.wait : initialState.bulkh.topTitle.wait;
            });
        },
        // 핫클릭 리스트 초기화.
        [CLEAR_HOTCLICK_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList = initialState.bulkh.hotclickList;
            });
        },
        // 핫클릭 리스트 변경 처리. ( 삭제,이동, 추가.)
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

        // 핫클릭 히스토리 클리어.
        [CLEAR_HOTCLICK_HISTORYLIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.totalCnt = initialState.bulkh.historyList.totalCnt;
                draft.bulkh.historyList.list = initialState.bulkh.historyList.list;
                draft.bulkh.historyList.article = initialState.bulkh.historyList.article;
                draft.bulkh.historyList.search.page = initialState.bulkh.historyList.search.page;
                draft.bulkh.historyList.search.size = initialState.bulkh.historyList.search.size;
            });
        },

        // 핫클릭 히스토리 가지고 오기.
        [GET_HOTCLICK_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.totalCnt = body.totalCnt;
                draft.bulkh.historyList.list = body.list;
            });
        },
        // 히스토리 그리드에서 옵션처리시 다시 가지고 오기.( 페이징)
        [CHANGE_HISTORY_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.search = payload;
            });
        },
        // 히스토리 상세
        [GET_HISTORY_DETAIL_SUCCESS]: (state, { payload: { bulkartSeq, body } }) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.article.totalCnt = body.totalCnt;
                draft.bulkh.historyList.article.list = body.LIST.list;
                draft.bulkh.historyList.article.selectSeq = bulkartSeq;
            });
        },
        // 핫클릭 히스토리 상제 클리어.
        [CLEAR_HISTORY_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.bulkh.historyList.article = initialState.bulkh.historyList.article;
            });
        },
        // 핫클릭 리스트 가지고 오기.
        [GET_HOTCLICK_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulkh.hotclickList.totalCnt = payload.totalCnt;
                draft.bulkh.hotclickList.list = payload.LIST.list;
            });
        },
    },
    initialState,
);
