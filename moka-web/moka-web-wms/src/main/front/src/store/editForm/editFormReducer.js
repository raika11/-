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
    historySearch: {
        page: 0,
        searchKeyword: '',
        size: PAGESIZE_OPTIONS[0],
        sort: 'seqNo,asc',
    },
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'formId,asc',
    },
    historyTotal: 0,
    historyList: [],
    editForm: {},
    editFormPart: {},
    editFormError: {},
    invalidList: [],
    partIdx: 0,
    publishModalShow: false,
    historyModalShow: false,
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
        /**
         * 데이터 변경
         */
        [act.CHANGE_EDIT_FORM_PART]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.editFormParts[state.partIdx].fieldGroups = JSON.parse(payload.recoveryData.formData);
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_FIELD]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.editFormParts[payload.partIdx].fieldGroups[payload.groupIdx].fields[payload.fieldIdx] = payload.field;
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
                draft.editForm = body.editForm;
                draft.editFormParts = body.editForm.editFormParts;
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
        /**
         * 퍼블리시 팝업창
         */
        [act.PUBLISH_MODAL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.editFormPart = payload.editFormPart;
                draft.publishModalShow = payload.show;
            });
        },
        /**
         * 이력 조회 팝업창
         */
        [act.HISTORY_MODAL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.historyList = [];
                draft.historyTotal = 0;
                draft.partIdx = payload.partIdx;
                draft.editFormPart = payload.editFormPart;
                draft.historyModalShow = payload.show;
            });
        },
        /**
         * 이력 목록
         */
        [act.GET_EDIT_FORM_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.historyList = body.list;
                draft.historyTotal = body.totalCnt;
            });
        },
        [act.GET_EDIT_FORM_HISTORY_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.historyList = initialState.list;
                draft.historyTotal = initialState.total;
            });
        },
    },
    initialState,
);
