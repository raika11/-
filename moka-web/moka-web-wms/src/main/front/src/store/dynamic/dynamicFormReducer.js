import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/dynamic/dynamicFormAction';
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
        sort: 'channelName,asc',
    },
    dynamicForm: {},
    dynamicFormError: {},
    invalidList: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 데이터 변경
         */
        [act.CHANGE_DYNAMIC]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.dynamicForm = payload;
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
        [act.CLEAR_DYNAMIC]: (state) => {
            return produce(state, (draft) => {
                draft.dynamicForm = initialState.dynamicForm;
                draft.dynamicFormError = initialState.dynamicFormError;
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
        [act.GET_DYNAMIC_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_DYNAMIC_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_DYNAMIC_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.dynamicForm = body;
                draft.dynamicFormError = initialState.dynamicFormError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_DYNAMIC_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.dynamicForm = initialState.dynamicForm;
                draft.dynamicFormError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_DYNAMIC_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.dynamicForm = initialState.dynamicForm;
                draft.dynamicFormError = initialState.dynamicFormError;
            });
        },
        [act.DELETE_DYNAMIC_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.dynamicFormError = payload;
            });
        },
    },
    initialState,
);
