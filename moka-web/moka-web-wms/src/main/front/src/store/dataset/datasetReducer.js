import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './datasetAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'datasetSeq,desc',
        apiCodeId: null,
        autoCreateYn: 'all',
        searchType: 'all',
        keyword: '',
    },
    dataset: {},
    datasetError: null,
    invalidList: [],
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 데이터 조회
         */
        [act.GET_DATASET_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_DATASET_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
    },
    initialState,
);
