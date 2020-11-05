import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './areaAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    depth1: {
        list: [],
        total: 0,
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            domainId: null,
            depth: 1,
        },
    },
    depth2: {
        list: [],
        total: 0,
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            domainId: null,
            depth: 2,
        },
    },
    depth3: {
        list: [],
        total: 0,
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            domainId: null,
            depth: 3,
        },
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
    invalidList: [],
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION_DEPTH1]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth1.search = payload;
            });
        },
        [act.CHANGE_SEARCH_OPTION_DEPTH2]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth2.search = payload;
            });
        },
        [act.CHANGE_SEARCH_OPTION_DEPTH3]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth3.search = payload;
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
        /**
         * 데이터 조회
         */
        [act.GET_AREA_LIST_DEPTH1_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.depth1.list = body.list;
                draft.depth1.total = body.total;
                draft.depth1.error = initialState.depth1.error;
            });
        },
        [act.GET_AREA_LIST_DEPTH1_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth1.list = initialState.depth1.list;
                draft.depth1.total = initialState.depth1.total;
                draft.depth1.error = payload;
            });
        },
        [act.GET_AREA_LIST_DEPTH2_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.depth2.list = body.list;
                draft.depth2.total = body.total;
                draft.depth2.error = initialState.depth2.error;
            });
        },
        [act.GET_AREA_LIST_DEPTH2_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth2.list = initialState.depth2.list;
                draft.depth2.total = initialState.depth2.total;
                draft.depth2.error = payload;
            });
        },
        [act.GET_AREA_LIST_DEPTH3_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.depth3.list = body.list;
                draft.depth3.total = body.total;
                draft.depth3.error = initialState.depth3.error;
            });
        },
        [act.GET_AREA_LIST_DEPTH3_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.depth3.list = initialState.depth3.list;
                draft.depth3.total = initialState.depth3.total;
                draft.depth3.error = payload;
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
        //         draft.componentError = initialState.componentError;
        //     });
        // },
    },
    initialState,
);
