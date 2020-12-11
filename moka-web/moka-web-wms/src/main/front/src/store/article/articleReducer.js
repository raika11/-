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
        deskingSourceList: null, // 매체
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
    invalidList: [],
    sourceList: null,
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
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 데이터 조회
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
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = payload;
            });
        },
        [act.GET_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.sourceList = body.list;
            });
        },
        [act.GET_SOURCE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.sourceList = initialState.sourceList;
            });
        },
    },
    initialState,
);
