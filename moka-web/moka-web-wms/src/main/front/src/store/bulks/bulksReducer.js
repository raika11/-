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
} from './bulksAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    bulkartDiv: '',
    sourceCode: '',
    bulkPathName: '',
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
    bulkArticle: {
        totalCnt: 0,
        list: [],
    },
    bulksError: null,
    invalidList: [],
    previewModal: {
        state: false,
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
};

export default handleActions(
    {
        // 전체 초기화.
        [CLEAR_STORE]: () => initialState,
        // 구분값 제외 초기화.
        [INITIALIZED_PARAMS]: (state, { payload: { bulk_div, bulk_source, bulkPathName } }) => {
            return produce(state, (draft) => {
                draft.search.bulkartDiv = bulk_div;
                draft.search.sourceCode = bulk_source;
                draft.bulkPathName = bulkPathName;
                draft.bulkartDiv = bulk_div;
                draft.sourceCode = bulk_source;
            });
        },
        // 리스트 초기화.
        [CLEAR_BULKS_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulks_list = initialState.list;
                draft.bulksError = initialState.bulksError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [CLEAR_BULKS_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.bulkArticle = initialState.bulkArticle;
            });
        },
        // 리스트 조회 성공.
        [GET_BULK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        // 리스트 조회 에러.
        [GET_BULK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        // 약물 가지고 오기 성공.
        [GET_SPECIALCHAR_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.specialchar = body;
            });
        },
        // 약물 가지고 오기 에러.
        [GET_SPECIALCHAR_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.specialchar = initialState.specialchar;
            });
        },
        // Copyright 가지고 오기 성공.
        [GET_COPYRIGHT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.copyright = body;
            });
        },
        // Copyright 가지고 오기 에러.
        [GET_COPYRIGHT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.copyright = initialState.copyright;
            });
        },

        // 미리 보기 모달 상태 및 데이터(미리보기에 쓰일 기사 리스트).
        [SHOW_PREVIEW_MODAL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.previewModal.state = payload.state;
                draft.previewModal.bulkArticle = payload.bulkArticle;
            });
        },
        // 미리보기 모달창 닫기 이벤트.
        [HIDE_PREVIEW_MODAL]: (state) => {
            return produce(state, (draft) => {
                draft.previewModal.state = false;
                draft.previewModal.bulkArticle = null;
            });
        },
        // 문구 상세 정보 가기고 오기 성공.
        [GET_BULK_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkArticle = body;
                draft.bulksError = initialState.bulksError;
            });
        },
        // 문구 상세 정보 가기고 오기 실패.
        [GET_BULK_ARTICLE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnistError = payload;
            });
        },
        // 검색 옵션 처리.
        [CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
    },
    initialState,
);
