import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@/store/editForm/editFormAction';
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
        sort: 'channelId,asc',
    },
    editForm: {},
    editFormError: {},
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
        [act.CHANGE_EDIT_FORM]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.editForm = payload;
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
        [act.CLEAR_EDIT_FORM]: (state) => {
            return produce(state, (draft) => {
                draft.editForm = initialState.editForm;
                draft.editFormError = initialState.editFormError;
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
        [act.GET_EDIT_FORM_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_EDIT_FORM_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_EDIT_FORM_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.editForm = body;
                draft.editFormError = initialState.editFormError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_EDIT_FORM_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.editForm = initialState.editForm;
                draft.editFormError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_EDIT_FORM_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.editForm = initialState.editForm;
                draft.editFormError = initialState.editFormError;
            });
        },
        [act.DELETE_EDIT_FORM_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.editFormError = payload;
            });
        },
    },
    initialState,
);
