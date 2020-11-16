import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './areaAction';
import { ITEM_CP, AREA_ALIGN_V } from '@/constants';

const area = {
    areaComps: [],
    areaDiv: ITEM_CP,
    areaNm: '',
    container: {},
    depth: 1,
    domain: {},
    ordNo: 1,
    page: {},
    parent: {},
    previewRsrc: '',
    usedYn: 'N',
    areaAlign: AREA_ALIGN_V,
};

export const areaCompLoad = {
    byContainer: false,
    byContainerMessage: null,
    byPage: false,
    byPageMessage: null,
    byContainerComp: false,
    byContainerCompMessage: null,
};

/**
 * initialState
 */
export const initialState = {
    depth1: {
        list: [],
        total: 0,
        error: null,
        search: {},
        area,
        areaCompLoad,
    },
    depth2: {
        list: [],
        total: 0,
        error: null,
        search: { parentAreaSeq: null },
        area: { ...area, depth: 2 },
        areaCompLoad,
    },
    depth3: {
        list: [],
        total: 0,
        error: null,
        search: { parentAreaSeq: null },
        area: { ...area, depth: 3 },
        areaCompLoad,
    },
    areaError: null,
    invalidList: [],
    selectedDepth: 1,
    treeError: null,
    tree: null,
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
        [act.CLEAR_AREA]: (state, { payload }) => {
            return produce(state, (draft) => {
                if (payload === 1) {
                    draft.depth1.area = initialState.depth1.area;
                } else if (payload === 2) {
                    draft.depth2.area = initialState.depth2.area;
                } else if (payload === 3) {
                    draft.depth3.area = initialState.depth3.area;
                }

                draft.areaError = initialState.areaError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                if (payload === 1) {
                    draft.depth1.list = initialState.depth1.list;
                    draft.depth1.total = initialState.depth1.total;
                    draft.depth1.error = initialState.depth1.error;
                } else if (payload === 2) {
                    draft.depth2.list = initialState.depth2.list;
                    draft.depth2.total = initialState.depth2.total;
                    draft.depth2.error = initialState.depth2.error;
                } else if (payload === 3) {
                    draft.depth3.list = initialState.depth3.list;
                    draft.depth3.total = initialState.depth3.total;
                    draft.depth3.error = initialState.depth3.error;
                }
            });
        },
        [act.CLEAR_TREE]: (state) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.treeError = initialState.treeError;
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
        /**
         * Area 데이터 상세 조회 결과
         */
        [act.GET_AREA_DEPTH1_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { area, areaCompLoad } = body;
                draft.depth1.area = area;
                draft.depth1.areaCompLoad = areaCompLoad;
                draft.areaError = initialState.areaError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_AREA_DEPTH1_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.areaError = payload;
            });
        },
        [act.GET_AREA_DEPTH2_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { area, areaCompLoad } = body;
                draft.depth2.area = area;
                draft.depth2.areaCompLoad = areaCompLoad;
                draft.areaError = initialState.areaError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_AREA_DEPTH2_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.areaError = payload;
            });
        },
        [act.GET_AREA_DEPTH3_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { area, areaCompLoad } = body;
                draft.depth3.area = area;
                draft.depth3.areaCompLoad = areaCompLoad;
                draft.areaError = initialState.areaError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_AREA_DEPTH3_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.areaError = payload;
            });
        },
        [act.GET_AREA_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.areaError = payload;
            });
        },
        /**
         * 편집영역 트리 조회(페이지편집용)
         */
        [act.GET_AREA_TREE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.tree = body;
                draft.areaError = initialState.areaError;
            });
        },
        [act.GET_AREA_TREE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.areaError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_AREA]: (state, { payload }) => {
            return produce(state, (draft) => {
                const { area, depth } = payload;

                if (depth === 1) {
                    draft.depth1.area = area;
                } else if (depth === 2) {
                    draft.depth2.area = area;
                } else if (depth === 3) {
                    draft.depth3.area = area;
                }
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        [act.CHANGE_SELECTED_DEPTH]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectedDepth = payload;
            });
        },
    },
    initialState,
);
