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
    },
    bulkh: {},
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
            });
        },
        // 리스트 초기화.
        [CLEAR_BULKS_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulkn.bulks_list = initialState.bulkn.list;
                draft.bulkn.bulksError = initialState.bulkn.bulksError;
                draft.bulkn.invalidList = initialState.bulkn.invalidList;
            });
        },
        [CLEAR_BULKS_ARTICLE]: (state) => {
            return produce(state, (draft) => {
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
        [GET_BULK_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkn.bulkArticle = body;
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
    },
    initialState,
);
