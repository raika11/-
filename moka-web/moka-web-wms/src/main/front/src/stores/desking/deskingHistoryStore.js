import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CLEAR_STORE = 'deskingHistoryStore/CLEAR_STORE';
export const CHANGE_SEARCH_OPTION = 'deskingHistoryStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'deskingHistoryStore/CHANGE_SEARCH_OPTIONS';
export const [
    GET_DESKING_HISTORIES_GROUP,
    GET_DESKING_HISTORIES_GROUP_SUCCESS,
    GET_DESKING_HISTORIES_GROUP_FAILURE
] = createRequestActionTypes('deskingHistoryStore/GET_DESKING_HISTORIES_GROUP');
export const [
    GET_DESKING_HISTORIES,
    GET_DESKING_HISTORIES_SUCCESS,
    GET_DESKING_HISTORIES_FAILURE
] = createRequestActionTypes('deskingHistoryStore/GET_DESKING_HISTORIES');
export const [
    GET_ALL_DESKING_HISTORIES_GROUP,
    GET_ALL_DESKING_HISTORIES_GROUP_SUCCESS,
    GET_ALL_DESKING_HISTORIES_GROUP_FAILURE
] = createRequestActionTypes('deskingHistoryStore/GET_ALL_DESKING_HISTORIES_GROUP');
export const [
    GET_ALL_DESKING_HISTORIES,
    GET_ALL_DESKING_HISTORIES_SUCCESS,
    GET_ALL_DESKING_HISTORIES_FAILURE
] = createRequestActionTypes('deskingHistoryStore/GET_ALL_DESKING_HISTORIES');
export const POST_DESKING_HISTORIES = 'deskingHistoryStore/POST_DESKING_HISTORIES';

/**
 * action creator
 */
export const clearStore = createAction(CLEAR_STORE, (...payload) => payload);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value, target }) => ({
    key,
    value,
    target
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, ({ changes, target }) => ({
    changes,
    target
}));
export const getDeskingHistoriesGroup = createAction(
    GET_DESKING_HISTORIES_GROUP,
    (payload) => payload
);
export const getDeskingHistories = createAction(GET_DESKING_HISTORIES, (payload) => payload);
export const getAllDeskingHistoriesGroup = createAction(
    GET_ALL_DESKING_HISTORIES_GROUP,
    (payload) => payload
);
export const getAllDeskingHistories = createAction(GET_ALL_DESKING_HISTORIES, (payload) => payload);
export const postDeskingHistories = createAction(
    POST_DESKING_HISTORIES,
    ({ search, componentWorkSeq }) => ({
        search,
        componentWorkSeq
    })
);

/**
 * initial state
 */
const initialState = {
    // 컴포넌트 > 그룹
    group: {
        total: 0,
        list: [],
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            detail: 'N'
        }
    },
    // 컴포넌트 > 상세
    detail: {
        list: [],
        error: null,
        search: {
            detail: 'Y',
            creator: '',
            createYmdt: '',
            sort: 'contentsOrder,asc'
        }
    },
    // 전체 > 그룹
    allGroup: {
        total: 0,
        list: [],
        error: null,
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[1]
        }
    },
    // 전체 > 상세
    allDetail: {
        list: [],
        error: null,
        search: {
            creator: '',
            createYmdt: '',
            sort: 'contentsOrder,asc'
        }
    }
};

/**
 * reducer
 */
const deskingHistoryStore = handleActions(
    {
        [CLEAR_STORE]: (state, { payload: targets }) => {
            if (targets.length < 1) {
                return initialState;
            }
            return produce(state, (draft) => {
                targets.forEach((target) => {
                    draft[target] = initialState[target];
                });
            });
        },
        /** 검색조건 변경 */
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value, target } }) => {
            return produce(state, (draft) => {
                draft[target].search[key] = value;
            });
        },
        [CHANGE_SEARCH_OPTIONS]: (state, { payload: { changes, target } }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < changes.length; idx++) {
                    let obj = changes[idx];
                    draft[target].search[obj.key] = obj.value;
                }
            });
        },
        /** 컴포넌트 > 그룹 목록 조회 결과 */
        [GET_DESKING_HISTORIES_GROUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { list, totalCnt } = body;
                draft.group.total = totalCnt;
                draft.group.list = list;
                draft.group.error = initialState.group.error;
            });
        },
        [GET_DESKING_HISTORIES_GROUP_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.group.list = initialState.group.list;
            });
        },
        /** 컴포넌트 > 상세 목록 조회 결과 */
        [GET_DESKING_HISTORIES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { list } = body;
                draft.detail.list = list;
                draft.detail.error = initialState.detail.error;
            });
        },
        [GET_DESKING_HISTORIES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.detail.list = initialState.detail.list;
            });
        },
        /** 전체 > 그룹 조회 결과 */
        [GET_ALL_DESKING_HISTORIES_GROUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { list, totalCnt } = body;
                draft.allGroup.total = totalCnt;
                draft.allGroup.list = list;
                draft.allGroup.error = initialState.allGroup.error;
            });
        },
        [GET_ALL_DESKING_HISTORIES_GROUP_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.allGroup.list = initialState.allGroup.list;
            });
        },
        /** 전체 > 상세 조회 결과 */
        [GET_ALL_DESKING_HISTORIES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                const { list } = body;
                draft.allDetail.list = list;
                draft.allDetail.error = initialState.allDetail.error;
            });
        },
        [GET_ALL_DESKING_HISTORIES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.allDetail.list = initialState.allDetail.list;
            });
        }
    },
    initialState
);

export default deskingHistoryStore;
