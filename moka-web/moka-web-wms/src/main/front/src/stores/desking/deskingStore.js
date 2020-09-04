import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { DESKING_TAB } from '~/constants';

/**
 * action
 */
export const CLEAR_DESKING = 'deskingStore/CLEAR_DESKING';
export const CHANGE_SEARCH_OPTION = 'deskingStore/CHANGE_SEARCH_OPTION';
export const [
    GET_COMPONENT_WORK_LIST,
    GET_COMPONENT_WORK_LIST_SUCCESS,
    GET_COMPONENT_WORK_LIST_FAILURE
] = createRequestActionTypes('deskingStore/GET_COMPONENT_WORK_LIST');
export const CHANGE_CONTENTS = 'deskingStore/CHANGE_CONTENTS';

export const COMPONENT_WORK_SUCCESS = 'deskingStore/COMPONENT_WORK_SUCCESS';
export const COMPONENT_WORK_FAILURE = 'deskingStore/COMPONENT_WORK_FAILURE';

export const GET_COMPONENT_WORK = 'deskingStore/GET_COMPONENT_WORK';
export const POST_COMPONENT_WORK = 'deskingStore/POST_COMPONENT_WORK';
export const PUT_COMPONENT_WORK = 'deskingStore/PUT_COMPONENT_WORK';
export const HAS_OTHER_SAVED = 'deskingStore/HAS_OTHER_SAVED';

export const PUT_DESKING_WORK_PRIORITY = 'deskingStore/PUT_DESKING_WORK_PRIORITY';
export const POST_DESKING_WORK = 'deskingStore/POST_DESKING_WORK';
export const POST_DESKING_WORK_LIST = 'deskingStore/POST_DESKING_WORK_LIST';
export const MOVE_DESKING_WORK_LIST = 'deskingStore/MOVE_DESKING_WORK_LIST';
export const PUT_DESKING_WORK = 'deskingStore/PUT_DESKING_WORK';
export const PUT_DESKING_REL_WORKS = 'deskingStore/PUT_DESKING_REL_WORKS';
export const DELETE_DESKING_WORK_LIST = 'deskingStore/DELETE_DESKING_WORK_LIST';
export const DELETE_DESKING_REL_WORK = 'deskingStore/DELETE_DESKING_REL_WORK';

export const OPEN_DUMMY_FORM = 'deskingStore/OPEN_DUMMY_FORM';

/**
 * action creator
 */
export const clearDesking = createAction(CLEAR_DESKING);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
// 페이지에 포함된 모든 컴포넌트를 서비중인 데이타로 초기화(복수)
export const getComponentWorkList = createAction(
    GET_COMPONENT_WORK_LIST,
    ({ pageSeq, direct, callback }) => ({
        pageSeq,
        direct,
        callback
    })
);
// 편집기사 선택
export const changeContents = createAction(CHANGE_CONTENTS, ({ component, contentsId }) => ({
    component,
    contentsId
}));
// 컴포넌트 조회(단수)
export const getComponentWork = createAction(
    GET_COMPONENT_WORK,
    ({ componentWorkSeq, callback }) => ({
        componentWorkSeq,
        callback
    })
);
// Work컴포넌트 순번수정
export const putDeskingWorkPriority = createAction(
    PUT_DESKING_WORK_PRIORITY,
    ({ component, callback }) => ({
        component,
        callback
    })
);
// 데스킹 워크 등록
export const postDeskingWork = createAction(
    POST_DESKING_WORK,
    ({ componentWorkSeq, datasetSeq, deskingWork, success }) => ({
        componentWorkSeq,
        datasetSeq,
        deskingWork,
        success
    })
);
// 데스킹 워크 목록 등록
export const postDeskingWorkList = createAction(
    POST_DESKING_WORK_LIST,
    ({ componentWorkSeq, datasetSeq, list, callback }) => ({
        componentWorkSeq,
        datasetSeq,
        list,
        callback
    })
);
// 데스킹 워크 목록 이동
export const moveDeskingWorkList = createAction(
    MOVE_DESKING_WORK_LIST,
    ({ componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list, callback }) => ({
        componentWorkSeq,
        datasetSeq,
        srcComponentWorkSeq,
        srcDatasetSeq,
        list,
        callback
    })
);
// 데스킹 워크 수정
export const putDeskingWork = createAction(PUT_DESKING_WORK, (payload) => payload);
// Work컴포넌트 전송
export const postComponentWork = createAction(
    POST_COMPONENT_WORK,
    ({ componentWorkSeq, callback }) => ({
        componentWorkSeq,
        callback
    })
);
// Work컴포넌트 수정
export const putComponentWork = createAction(
    PUT_COMPONENT_WORK,
    ({ componentWorkSeq, snapshotYn, snapshotBody, templateSeq, callback }) => ({
        componentWorkSeq,
        snapshotYn,
        snapshotBody,
        templateSeq,
        callback
    })
);
// 다른사람이 저장했는지 조사
export const hasOtherSaved = createAction(
    HAS_OTHER_SAVED,
    ({ componentWorkSeq, datasetSeq, callback }) => ({
        componentWorkSeq,
        datasetSeq,
        callback
    })
);
// work편집기사 삭제
export const deleteDeskingWorkList = createAction(
    DELETE_DESKING_WORK_LIST,
    ({ componentWorkSeq, datasetSeq, list, noMessage, callback }) => ({
        componentWorkSeq,
        datasetSeq,
        list,
        noMessage,
        callback
    })
);
// 데스킹워크의 관련기사 수정
export const putDeskingRelWorks = createAction(PUT_DESKING_REL_WORKS, (payload) => payload);
// 데스킹워크의 관련기사 삭제
export const deleteDeskingRelWork = createAction(DELETE_DESKING_REL_WORK, (payload) => payload);
// 더미폼 오픈여부
export const openDummyForm = createAction(OPEN_DUMMY_FORM, (payload) => payload);

/**
 * initial
 */
export const initialState = {
    list: [],
    total: 0,
    error: null,
    search: {
        pageSeq: null,
        tab: DESKING_TAB
    },
    latestContentsId: null,
    component: null,
    componentError: null,
    openDummyForm: false,
    pageInfo: null
};

/**
 * reducer
 */
const deskingStore = handleActions(
    {
        // clear
        [CLEAR_DESKING]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_COMPONENT_WORK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            const { list, page, totalCnt } = body;
            return produce(state, (draft) => {
                draft.list = list;
                draft.totatl = totalCnt;
                draft.pageInfo = page;
                draft.error = initialState.error;
            });
        },
        // 목록 조회 실패
        [GET_COMPONENT_WORK_LIST_FAILURE]: (state, { payload: error }) => ({
            ...state,
            list: null,
            error
        }),
        // 선택된 편집기사 변경
        [CHANGE_CONTENTS]: (state, { payload: { component, contentsId } }) => {
            return produce(state, (draft) => {
                if (component || component === null) {
                    draft.component = component;
                }
                draft.latestContentsId = contentsId;
            });
        },
        // 컴포넌트 work 조회 성공
        [COMPONENT_WORK_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                let idx = draft.list.findIndex((l) => l.seq === body.seq);
                draft.list[idx] = body;
                draft.component = body;
                draft.componentError = initialState.componentError;
            });
        },
        // 컴포넌트 work 조회 실패
        [COMPONENT_WORK_FAILURE]: (state, { payload: componentError }) => ({
            ...state,
            componentError
        }),
        [OPEN_DUMMY_FORM]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.openDummyForm = payload;
            });
        }
    },
    initialState
);

export default deskingStore;
