import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './editLogAction';
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
        sort: 'seqNo,desc',
        searchType: 'all',
        keyword: '',
        successYn: '',
        startDt: null,
        endDt: null,
    },
    successYnList: [
        { id: '', name: '전체' },
        { id: 'Y', name: '성공' },
        { id: 'N', name: '실패' },
    ],
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'memberId', name: '사용자ID' },
        { id: 'regIp', name: '사용자IP' },
        { id: 'menuNm', name: '메뉴명' },
    ],
    editLog: {},
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
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_EDIT_LOG]: (state) => {
            return produce(state, (draft) => {
                draft.editLog = initialState.editLog;
            });
        },
        /**
         * 목록
         */
        [act.GET_EDIT_LOG_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_EDIT_LOG_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회
         */
        [act.GET_EDIT_LOG_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.editLog = body;
            });
        },
    },
    initialState,
);
