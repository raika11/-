import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './areaAction';
import { ITEM_CP, AREA_ALIGN_V } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    // area 초기 데이터
    initData: {
        area: {
            areaComp: {},
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
        },
        areaCompLoad: {
            byContainer: false,
            byContainerMessage: null,
            byPage: false,
            byPageMessage: null,
            byContainerComp: false,
            byContainerCompMessage: null,
        },
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
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_TREE]: (state) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.treeError = initialState.treeError;
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
