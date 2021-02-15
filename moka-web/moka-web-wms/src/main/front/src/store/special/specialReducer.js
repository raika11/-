import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './specialAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'seqNo,desc',
        pageCd: 'all',
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'pageTitle', name: '제목' },
        { id: 'devName', name: '담당자' },
    ],
    special: {
        seqNo: null,
        repDeptNameSelect: 'self',
        ordinal: '1',
        pageTitle: '',
        pcUrl: '',
        mobUrl: '',
    },
    specialError: null,
    invalidList: [],
    depts: null,
};

export default handleActions(
    {
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_SPECIAL]: (state) => {
            return produce(state, (draft) => {
                draft.special = initialState.special;
            });
        },
        [act.GET_SPECIAL_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.specialError = initialState.specialError;
            });
        },
        [act.GET_SPECIAL_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.specialError = payload;
            });
        },
        [act.GET_SPECIAL_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.special = { ...body, repDeptNameSelect: 'self' };
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_SPECIAL_DEPT_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.depts = body.list;
            });
        },
        [act.GET_SPECIAL_DEPT_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.depts = initialState.depts;
            });
        },
        [act.DELETE_SPECIAL_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.special = initialState.special;
            });
        },
    },
    initialState,
);
