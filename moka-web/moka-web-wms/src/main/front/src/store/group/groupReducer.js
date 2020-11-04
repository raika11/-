import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/group/groupAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    error: null,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'grpCd,asc',
    },
    group: {},
    groupError: {},
    invalidList: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.search = newSearch;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_GROUP]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.group = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_GROUP]: (state) => {
            return produce(state, (draft) => {
                draft.group = initialState.group;
                draft.groupError = initialState.groupError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 목록
         */
        [act.GET_GROUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_GROUP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_GROUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.group = body;
                draft.groupError = initialState.groupError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_GROUP_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.group = initialState.group;
                draft.groupError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_GROUP_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.group = initialState.group;
                draft.groupError = initialState.groupError;
            });
        },
        [act.DELETE_GROUP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.groupError = payload;
            });
        },
    },
    initialState,
);
