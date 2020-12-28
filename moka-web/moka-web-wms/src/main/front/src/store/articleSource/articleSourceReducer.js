import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleSourceAction';
import { PAGESIZE_OPTIONS, MODAL_PAGESIZE_OPTIONS } from '@/constants';

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
        sort: 'sourceCode,asc',
        searchType: 'sourceName',
        keyword: '',
    },
    source: {
        artEditYn: 'N',
        rcvUsedYn: 'Y',
        joongangUse: 'N',
        jstoreUse: 'N',
        consalesUse: 'N',
        ilganUse: 'N',
        socialUse: 'N',
        bulkFlag: 'N',
        receiveImgYn: 'N',
    },
    invalidList: [],
    mappingTotal: 0,
    mappingList: [],
    mappingSearch: {
        page: 0,
        size: MODAL_PAGESIZE_OPTIONS[0],
        sourceCode: null,
    },
    mappingCode: {},
    deskingSourceList: null,
    typeSourceList: {},
    bulkSourceList: null,
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
        [act.CHANGE_MODAL_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.mappingSearch = payload;
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
        [act.CLEAR_MAPPING_CODE]: (state) => {
            return produce(state, (draft) => {
                draft.mappingCode = initialState.mappingCode;
            });
        },
        [act.CLEAR_MAPPING_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.mappingTotal = initialState.mappingTotal;
                draft.mappingList = initialState.mappingList;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_MAPPING_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.mappingSearch = initialState.mappingSearch;
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
        // 매핑 목록 조회
        [act.GET_MAPPING_CODE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.mappingTotal = body.totalCnt;
                draft.mappingList = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_MAPPING_CODE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.mappingTotal = initialState.mappingTotal;
                draft.mappingList = initialState.mappingList;
                draft.error = payload;
            });
        },
        // 매핑 코드 상세 조회
        [act.GET_MAPPING_CODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.mappingCode = body;
            });
        },
        [act.GET_MAPPING_CODE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.mappingCode = initialState.mappingCode;
            });
        },
        // 매핑 코드 삭제
        [act.DELETE_MAPPING_CODE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.mappingCode = initialState.mappingCode;
            });
        },
        [act.DELETE_MAPPING_CODE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
            });
        },
        // // 벌크 매체 조회
        // [act.GET_BLUK_SOURCE_LIST_SUCCESS]: (state, { payload: { body } }) => {
        //     return produce(state, (draft) => {
        //         draft.bulkSourceList = body.list;
        //     });
        // },
        // [act.GET_BLUK_SOURCE_LIST_FAILURE]: (state) => {
        //     return produce(state, (draft) => {
        //         draft.bulkSourceList = initialState.bulkSourceList;
        //     });
        // },
    },
    initialState,
);
