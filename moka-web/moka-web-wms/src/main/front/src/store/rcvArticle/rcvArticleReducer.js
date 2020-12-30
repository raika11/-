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
        depart: null, // 섹션
        status: 'all', // all(전체), B(작업전), Y(등록)
        modify: 'all', // all(전체), D(원본만), U(수정만)
        searchType: 'title',
        keyword: '',
    },
    statusList: [
        { id: 'all', name: '전체' },
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
        title: '',
    },
    invalidList: [],
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
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_RCV_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.rcvArticle = initialState.rcvArticle;
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
    },
    initialState,
);
