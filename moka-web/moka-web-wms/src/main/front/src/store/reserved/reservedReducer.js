import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './reservedAction';
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
        sort: 'reservedId,desc',
        domainId: null,
        searchType: 'all',
        keyword: '',
    },
    reserved: {},
    reservedError: null,
    latestReservedSeq: null,
    invalidList: [],
};
export const defaultSearch = {
    domainId: null,
    searchType: 'all',
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    sort: 'reservedId,desc',
    keyword: '',
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 예약어 목록
         */
        [act.GET_RESERVED_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_RESERVED_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        /**
         * 예약어 조회, 등록, 수정
         */
        [act.GET_RESERVED_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reserved = body;
                draft.latestReservedSeq = body.reservedSeq;
                draft.reservedError = initialState.reservedError;
            });
        },
        [act.GET_RESERVED_FAILURE]: (state, { payload }) => {
            const { body } = payload;
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 예약어 삭제
         */
        [act.DELETE_RESERVED_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = initialState.reservedError;
            });
        },
        [act.DELETE_RESERVED_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reservedError = payload;
            });
        },
        /**
         * 검색 옵션 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.search = newSearch;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_RESERVED]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reserved = payload;
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
        [act.CLEAR_RESERVED]: (state) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = initialState.reservedError;
                draft.invalidList = initialState.invalidList;
                draft.latestReservedSeq = null;
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
    },
    initialState,
);
