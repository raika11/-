import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './deskingAction';
import { PAGESIZE_OPTIONS, DESK_STATUS_SAVE, DESK_STATUS_WORK, DESK_STATUS_PUBLISH } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    area: {
        areaComps: [],
        areaComp: {},
    },
    isNaverChannel: false,
    isNaverStand: false,
    list: [],
    workStatus: {},
    total: 0,
    error: null,
    selectedComponent: {
        seq: null,
        componentSeq: null,
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
    history: {
        componentWorkHistory: {
            list: [],
            total: 0,
            search: {
                areaSeq: null,
                page: 0,
                size: PAGESIZE_OPTIONS[0],
                sort: 'seq,desc',
                regDt: null,
                status: DESK_STATUS_PUBLISH,
                searchType: 'all', // all/regId/regNm
                keyword: '',
            },
        },
        deskingWorkHistory: {
            list: [],
        },
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
        [act.CLEAR_HISTORY_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.history.componentWorkHistory.list = initialState.history.componentWorkHistory.list;
                draft.history.deskingWorkHistory.list = initialState.history.deskingWorkHistory.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_DESKING_HISTORY_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.history.deskingWorkHistory.list = initialState.history.deskingWorkHistory.list;
            });
        },
        /**
         * 선택된 컴포넌트 데이터 초기화
         */
        [act.CLEAR_SELECTED_COMPONENT]: (state) => {
            return produce(state, (draft) => {
                draft.history.selectedComponent = initialState.history.selectedComponent;
            });
        },
        /**
         * 검색 옵션 변경
         */
        [act.CHANGE_HISTORY_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.history.componentWorkHistory.search = payload;
            });
        },
        /**
         * work status 변경
         */
        [act.CHANGE_WORK_STATUS]: (state, { payload }) => {
            const { componentWorkSeq, status } = payload;

            return produce(state, (draft) => {
                draft.workStatus[componentWorkSeq] = status;
            });
        },
        /**
         * 편집영역 데이터 조회
         */
        [act.GET_COMPONENT_WORK_LIST_SUCCESS]: (state, { payload: { body, isNaverChannel, isNaverStand } }) => {
            return produce(state, (draft) => {
                if (body === null) {
                    draft.list = initialState.list;
                    draft.area = initialState.area;
                    draft.isNaverChannel = initialState.isNaverChannel;
                    draft.naverChannelTemplate = initialState.naverChannelTemplate;
                    draft.error = initialState.error;
                    draft.selectedComponent = initialState.selectedComponent;
                } else {
                    const { area, desking: maybeDesking } = body;
                    const desking = maybeDesking || [];
                    draft.list = desking;
                    draft.area = area;
                    draft.error = initialState.error;

                    // 네이버채널 페이지 체크
                    draft.isNaverChannel = isNaverChannel;

                    // 네이버스탠드 페이지 체크
                    draft.isNaverStand = isNaverStand;

                    if (!area.areaComps && !Array.isArray(area.areaComps)) {
                        draft.area.areaComps = [];
                    }

                    // selectedComponent 설정
                    const org = draft.selectedComponent.seq ? desking.find((d) => d.seq === draft.selectedComponent.seq) : null;
                    if (!org && desking.length > 0) {
                        draft.selectedComponent = desking[0];
                    }
                }
            });
        },
        [act.GET_COMPONENT_WORK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.selectedComponent = initialState.selectedComponent;
            });
        },
        /**
         * 컴포넌트 워크 조회
         */
        [act.COMPONENT_WORK_SUCCESS]: (state, { payload: { body, status } }) => {
            return produce(state, (draft) => {
                let idx = draft.list.findIndex((l) => l.seq === body.seq);
                draft.list[idx] = body;
                draft.selectedComponent = body;

                // 워크 / 임시저장 / 전송 상태 저장
                if (status === DESK_STATUS_WORK || status === DESK_STATUS_SAVE || status === DESK_STATUS_PUBLISH) {
                    draft.workStatus[body.seq] = status;
                }
            });
        },
        [act.COMPONENT_WORK_FAILURE]: (state, { payload: componentError }) => {
            return produce(state, (draft) => {
                // draft.selectedComponent = initialState.selectedComponent;
                // draft.componentError = initialState.componentError;
            });
        },
        /**
         * 컴포넌트 워크 조회
         */
        [act.POST_DESKING_WORK_LIST_MOVE_SUCCESS]: (state, { payload: { body, status } }) => {
            return produce(state, (draft) => {
                // source
                let sourceIdx = draft.list.findIndex((l) => l.seq === body.source.seq);
                draft.list[sourceIdx] = body.source;
                // source 워크 / 임시저장 / 전송 상태 저장
                draft.workStatus[body.source.seq] = status;

                // target
                let targetIdx = draft.list.findIndex((l) => l.seq === body.target.seq);
                draft.list[targetIdx] = body.target;
                draft.selectedComponent = body.target;
                // target 워크 / 임시저장 / 전송 상태 저장
                draft.workStatus[body.target.seq] = status;
            });
        },
        [act.POST_DESKING_WORK_LIST_MOVE_FAILURE]: (state, { payload: componentError }) => {
            return produce(state, (draft) => {
                // draft.selectedComponent = initialState.selectedComponent;
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
        /**
         * 히스토리 조회
         */
        [act.GET_COMPONENT_WORK_HISTORY_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.history.componentWorkHistory.list = body.list;
                draft.history.componentWorkHistory.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_COMPONENT_WORK_HISTORY_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.history.componentWorkHistory.list = initialState.history.componentWorkHistory.list;
                draft.history.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_DESKING_WORK_HISTORY_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.history.deskingWorkHistory.list = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_DESKING_WORK_HISTORY_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.history.deskingWorkHistory.list = initialState.history.deskingWorkHistory.list;
                draft.error = payload;
            });
        },
    },
    initialState,
);
