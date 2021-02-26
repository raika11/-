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
    invalidList: [],
    selectedDepth: 1,
    tree: null,
    treeBySeq: {},
};

const makeTreeBySeq = (list, treeBySeq) => {
    for (let i = 0; i < list.length; i++) {
        const node = list[i];
        treeBySeq[node.areaSeq] = node;
        if (node.nodes) {
            makeTreeBySeq(node.nodes, treeBySeq);
        }
    }
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
                draft.treeBySeq = initialState.treeBySeq;
            });
        },
        /**
         * 편집영역 트리 조회 => 페이지 편집에서 사용!!
         */
        [act.GET_AREA_TREE_SUCCESS]: (state, { payload: { body } }) => {
            const treeBySeq = {};
            makeTreeBySeq([...body], treeBySeq);

            return produce(state, (draft) => {
                draft.tree = body;
                draft.treeBySeq = treeBySeq;
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
