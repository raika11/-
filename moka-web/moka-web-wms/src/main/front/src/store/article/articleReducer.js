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
        sourceList: null, // 매체
        masterCode: null, // 분류
        startServiceDay: null, // 시작일
        endServiceDay: null, // 종료일
        contentType: null, // 기사타입
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'artTitle', name: '제목' },
        { id: 'totalId', name: '기사ID' },
        { id: 'artReporter', name: '기자명' },
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
            sourceList: null, // 매체
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
            sourceList: null, // 매체
            masterCode: null, // 분류
            startServiceDay: null, // 시작일
            endServiceDay: null, // 종료일
            contentType: null, // 기사타입
        },
    },
    imageList: [],
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
