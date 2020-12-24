import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleSourceAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    sourceList: [],
    error: null,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'sourceCode,desc',
        searchType: 'sourceName',
        keyword: '',
    },
    source: {},
    bulkSourceList: null,
    invalidList: [],
    deskingSourceList: null,
    typeSourceList: {},
};

export default handleActions(
    {
        // 데스킹 매체 조회
        [act.GET_DESKING_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deskingSourceList = body.list;
            });
        },
        [act.GET_DESKING_SOURCE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.deskingSourceList = initialState.deskingSourceList;
            });
        },
        // 타입별 매체 조회
        [act.GET_TYPE_SOURCE_LIST_SUCCESS]: (state, { payload: { body, payload } }) => {
            return produce(state, (draft) => {
                draft.typeSourceList[payload.type] = body.list;
            });
        },
        [act.GET_TYPE_SOURCE_LIST_FAILURE]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.typeSourceList[payload.type] = null;
            });
        },
        // 검색조건 변경
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        // 스토어 데이터 삭제
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_ARTICLE_SOURCE]: (state) => {
            return produce(state, (draft) => {
                draft.source = initialState.source;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.sourceList = initialState.sourceList;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        // 매체 목록 조회
        [act.GET_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.total = body.totalCnt;
                draft.sourceList = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_SOURCE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.sourceList = initialState.sourceList;
                draft.error = payload;
            });
        },
        // 매체 상세 조회
        [act.GET_ARTICLE_SOURCE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.source = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_ARTICLE_SOURCE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.source = initialState.source;
            });
        },
        // 벌크 매체 조회
        [act.GET_BLUK_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.bulkSourceList = body.list;
            });
        },
        [act.GET_BLUK_SOURCE_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.bulkSourceList = initialState.bulkSourceList;
            });
        },
    },
    initialState,
);
