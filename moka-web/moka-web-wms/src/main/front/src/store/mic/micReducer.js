import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './micAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        keyword: '',
        agndTop: 'Y',
    },
    agndTopList: [
        { id: 'all', name: '전체 메뉴' },
        { id: 'Y', name: '최상단' },
    ],
    agenda: {
        usedYn: 'Y',
        agndTop: 'N',
        agndType: '0',
        categoryList: [],
        relArticleList: [],
    },
    category: {
        list: [],
        search: {
            includeDel: 'Y', // 삭제된 것까지 검색 포함 여부 (Y/N)
        },
    },
    banner: {
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
        },
    },
    feed: {
        total: 0,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            loginSns: 'P',
            agndSeq: null,
        },
        feed: {
            usedYn: 'N',
            answerRel: null,
        },
    },
    post: {
        total: 0,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            agndSeq: null,
            usedYn: 'Y',
        },
        post: {
            answerRel: null,
        },
    },
    invalidList: [],
    answTotal: 0,
    agndTotal: 0,
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
        [act.CHANGE_FEED_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.feed.search = payload;
            });
        },
        [act.CHANGE_POST_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.post.search = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_MIC_AGENDA]: (state) => {
            return produce(state, (draft) => {
                draft.agenda = initialState.agenda;
            });
        },
        [act.CLEAR_MIC_FEED]: (state) => {
            return produce(state, (draft) => {
                draft.feed = initialState.feed;
            });
        },
        [act.CLEAR_MIC_POST]: (state) => {
            return produce(state, (draft) => {
                draft.post = initialState.post;
            });
        },
        /**
         * 아젠다 목록 조회
         */
        [act.GET_MIC_AGENDA_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        /**
         * 아젠다 상세 조회
         */
        [act.GET_MIC_AGENDA_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.agenda = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 아젠다, 전체 포스트 수
         */
        [act.GET_MIC_REPORT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.answTotal = body.answTotal;
                draft.agndTotal = body.agndTotal;
            });
        },
        /**
         * 카테고리
         */
        [act.GET_MIC_CATEGORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.category.list = body.list;
            });
        },
        /**
         * 피드
         */
        [act.GET_MIC_FEED_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.feed.list = body.list;
                draft.feed.total = body.totalCnt;
            });
        },
        /**
         * 피드 상세 조회
         */
        [act.GET_MIC_FEED_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.feed.feed = body;
            });
        },
        /**
         * 포스트
         */
        [act.GET_MIC_POST_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.post.list = body.list;
                draft.post.total = body.totalCnt;
            });
        },
        /**
         * 포스트 상세 조회
         */
        [act.GET_MIC_POST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.post.post = body;
            });
        },
    },
    initialState,
);
