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
        { id: 'seqNo', name: '아이디' },
        { id: 'pageTitle', name: '제목' },
        { id: 'devName', name: '담당자' },
    ],
    special: {},
    specialError: null,
    invalidList: [],
};

export default handleActions(
    {
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [act.CLEAR_STORE]: () => initialState,
        [act.GET_SPECIAL_LIST_SUCCESS]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.invalidList = initialState.invalidList;
            });
        },
    },
    initialState,
);
