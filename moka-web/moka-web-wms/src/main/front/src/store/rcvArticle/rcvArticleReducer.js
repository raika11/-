import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';
import * as act from './rcvArticleAction';

/**
 * initialState
 */
export const initialState = {
    list: [],
    total: 0,
    error: null,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'rid,desc',
        startDay: null, // 시작일 (필수조건)
        endDay: null, // 종료일 (필수조건)
        sourceList: null, // 매체(출처) (필수조건)
        status: 'all', // all(전체), B(작업전), Y(등록)
        modify: 'all', // all(전체), D(원본만), U(수정만)
        searchType: 'title',
        keyword: '',
    },
    statusList: [
        { id: 'all', name: '상태 전체' },
        { id: 'B', name: '작업전' },
        { id: 'Y', name: '등록' },
    ],
    modifyList: [
        { id: 'all', name: '전체' },
        { id: 'D', name: '원본만' },
        { id: 'U', name: '수정만' },
    ],
    rcvArticle: {
        rid: null,
        codeList: [],
        articleSource: {},
        totalId: null,
        title: '',
    },
    invalidList: [],
    jopanList: [],
    jopanTotal: 0,
    jopanSearch: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        section: 'all',
        pressDate: '',
        ho: '',
        myun: '',
    },
    jopan: {},
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 조판 검색조건 변경
         */
        [act.CHANGE_JOPAN_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jopanSearch = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_RCV_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.rcvArticle = initialState.rcvArticle;
            });
        },
        [act.CLEAR_JOPAN]: (state) => {
            return produce(state, (draft) => {
                draft.jopan = initialState.jopan;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_RCV_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_RCV_ARTICLE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_RCV_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.rcvArticle = body;
            });
        },
        /**
         * 수신기사 등록
         */
        // [act.POST_RCV_ARTICLE_SUCCESS]: () => {},
        // [act.POST_RCV_ARTICLE_FAILURE]: () => {},
        /**
         * 조판 목록 조회
         */
        [act.GET_JOPAN_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.jopanList = body.list;
                draft.jopanTotal = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_JOPAN_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jopanList = initialState.jopanList;
                draft.jopanTotal = initialState.jopanTotal;
                draft.error = payload;
            });
        },
        /**
         * 조판 정보 변경
         */
        [act.CHANGE_JOPAN]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jopan = payload;
            });
        },
    },
    initialState,
);
