import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './deskingAction';

/**
 * initialState
 */
export const initialState = {
    area: {
        areaComps: [],
    },
    list: [],
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
        snapshotYn: 'N',
        snapshotBody: null,
        componentOrd: 0,
        schCodeId: '',
        artPageSeq: null,
        viewYn: 'N',
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
                draft.list = body.desking;
                draft.area = body.area;
                draft.error = initialState.error;
            });
        },
        [act.GET_COMPONENT_WORK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error.error = payload;
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
    },
    initialState,
);
