import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleAction';
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
        searchType: 'all',
        keyword: '',
        pressPan: null, // 판
        pressMyun: null, // 면
        sourceList: null, // 매체(구분자 ,)
        masterCode: null, // 분류(1개)
        startServiceDay: null, // 시작일
        endServiceDay: null, // 종료일
        contentType: null, // 기사타입(all, P, N)
        pressCategory: null, // 출판 카테고리
        bulkYn: 'all', // 벌크여부(all, Y, N)
    },
    article: {
        totalId: null,
        categoryList: [],
        reporterList: [],
        tagList: [],
        pressDate: '',
        artContent: {},
        bulkSiteList: [],
    },
    invalidList: [],
    contentTypeList: [
        { id: 'all', name: '기사타입 전체' },
        { id: 'P', name: '포토뉴스' },
        { id: 'N', name: '일반뉴스' },
    ],
    bulkYnList: [
        { id: 'all', name: '벌크 전체' },
        { id: 'Y', name: '벌크기사' },
        { id: 'N', name: '벌크제외' },
    ],
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'title', name: '제목' },
        { id: 'totalId', name: '기사ID' },
        { id: 'reporterName', name: '기자명' },
    ],
    // 서비스 기사 리스트
    service: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'all',
            keyword: '',
            pressPan: null, // 판
            pressMyun: null, // 면
            sourceList: null, // 매체(구분자 ,)
            masterCode: null, // 분류
            startServiceDay: null, // 시작일
            endServiceDay: null, // 종료일
            contentType: null, // 기사타입
        },
    },
    // 벌크 기사 리스트
    bulk: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'all',
            keyword: '',
            pressPan: null, // 판
            pressMyun: null, // 면
            sourceList: null, // 매체(구분자 ,)
            masterCode: null, // 분류
            startServiceDay: null, // 시작일
            endServiceDay: null, // 종료일
            contentType: null, // 기사타입
        },
    },
    imageList: [],
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
        [act.CHANGE_SERVICE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.service.search = payload;
            });
        },
        [act.CHANGE_BULK_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulk.search = payload;
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
        // [act.CLEAR_LIST]: (state) => {
        //     return produce(state, (draft) => {
        //         draft.total = initialState.total;
        //         draft.list = initialState.list;
        //         draft.error = initialState.error;
        //     });
        // },
        [act.CLEAR_SERVICE_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.service.total = initialState.service.total;
                draft.service.list = initialState.service.list;
                draft.service.error = initialState.service.error;
            });
        },
        [act.CLEAR_BULK_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.bulk.total = initialState.bulk.total;
                draft.bulk.list = initialState.bulk.list;
                draft.bulk.error = initialState.bulk.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        [act.CLEAR_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.article = initialState.article;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 기사 조회
         */
        [act.GET_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.total = body.totalCnt;
                draft.list = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_ARTICLE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = initialState.totalCnt;
                draft.list = initialState.list;
                draft.error = payload;
            });
        },
        [act.GET_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.article = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_ARTICLE_FAILURE]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.invalidList = body.list;
            });
        },
        /**
         * 서비스 기사 조회
         */
        [act.GET_SERVICE_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.service.total = body.totalCnt;
                draft.service.list = body.list;
                draft.service.error = initialState.service.error;
            });
        },
        [act.GET_SERVICE_ARTICLE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.service.total = initialState.service.total;
                draft.service.list = initialState.service.list;
                draft.service.error = payload;
            });
        },
        /**
         * 벌크 기사 조회
         */
        [act.GET_BULK_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulk.total = body.totalCnt;
                draft.bulk.list = body.list;
                draft.bulk.error = initialState.bulk.error;
            });
        },
        [act.GET_BULK_ARTICLE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.bulk.total = initialState.bulk.total;
                draft.bulk.list = initialState.bulk.list;
                draft.bulk.error = payload;
            });
        },
        /**
         * 기사 내 이미지
         */
        [act.GET_ARTICLE_IMAGE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.imageList = body.list;
            });
        },
        [act.GET_ARTICLE_IMAGE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.imageList = initialState.imageList;
            });
        },
    },
    initialState,
);
