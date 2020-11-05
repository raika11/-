import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './areaAction';
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
        domainId: null,
        depth: 1,
        searchType: 'all',
        keyword: '',
    },
    area: {
        areaComps: [],
        areaDiv: '',
        areaNm: '',
        container: {},
        depth: 1,
        domain: {},
        ordNo: 1,
        page: {},
        parent: {},
        previewRsrc: '',
        usedYn: 'N',
    },
    areaError: null,
    inputTag: '',
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
        [act.CLEAR_AREA]: (state) => {
            return produce(state, (draft) => {
                draft.area = initialState.area;
                draft.areaError = initialState.areaError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
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
        [act.GET_AREA_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_AREA_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_AREA_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.area = body;
                draft.areaError = initialState.areaError;
            });
        },
        [act.GET_AREA_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.areaError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_AREA]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.area = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 데이터 삭제
         */
        // [act.DELETE_COMPONENT_SUCCESS]: (state) => {
        //     return produce(state, (draft) => {
        //         draft.component = initialState.component;
        //         draft.inputTag = initialState.inputTag;
        //         draft.componentError = initialState.componentError;
        //     });
        // },
    },
    initialState,
);
