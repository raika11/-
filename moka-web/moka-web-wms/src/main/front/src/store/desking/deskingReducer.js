import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './deskingAction';

/**
 * initialState
 */
export const initialState = {
    area: {
        areaComps: [],
        areaComp: {},
    },
    list: [],
    deskingStateList: [],
    total: 0,
    error: null,
    selectedComponent: {
        seq: 0,
        componentSeq: 0,
        componentName: '',
        regId: '',
        templateSeq: 0,
        templateName: '',
        templateWidth: 0,
        datasetSeq: 0,
        dataType: '',
        zone: null,
        matchZone: null,
        viewYn: 'N',
        snapshotYn: null,
        snapshotBody: null,
        perPageCount: 0,
        componentOrd: 0,
        schCodeId: '',
        artPageSeq: null,
        reserveDt: null,
        deskingWorks: [],
    },
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_COMPONENT_WORK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { area, desking } = body;
                draft.list = desking;
                draft.area = area;
                if (!area.areaComps && !Array.isArray(area.areaComps)) {
                    draft.area.areaComps = [];
                }
                draft.error = initialState.error;
            });
        },
        [act.GET_COMPONENT_WORK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
            });
        },
        /**
         * 컴포넌트 워크 조회
         */
        [act.COMPONENT_WORK_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                let idx = draft.list.findIndex((l) => l.seq === body.seq);
                draft.list[idx] = body;
                draft.selectedComponent = body;
                // draft.componentError = initialState.componentError;
            });
        },
        [act.COMPONENT_WORK_FAILURE]: (state, { payload: componentError }) => {
            return produce(state, (draft) => {
                if (draft.selectedComponent.seq) {
                    let idx = draft.list.findIndex((l) => l.seq === draft.selectedComponent.seq);
                    draft.list[idx] = initialState.selectedComponent;
                }
                draft.selectedComponent = initialState.selectedComponent;
                // draft.componentError = initialState.componentError;
            });
        },
        /**
         * 편집영역 변경
         */
        [act.CHANGE_AREA]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.area = payload;
            });
        },
    },
    initialState,
);
