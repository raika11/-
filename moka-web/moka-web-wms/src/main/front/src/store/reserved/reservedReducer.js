import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './reservedAction';
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
        sort: 'reservedId,desc',
        domainId: null,
        searchType: 'all',
        keyword: '',
    },
    reserved: {},
    reservedError: null,
    latestReservedSeq: null,
};

export default handleActions(
    {
        /**
         * 예약어 조회
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
        [act.GET_RESERVED_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reserved = body;
                draft.latestReservedSeq = body.reservedSeq;
                draft.reservedError = initialState.reservedError;
            });
        },
        [act.GET_RESERVED_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = payload;
            });
        },
        /**
         * 예약어 삭제
         */
        [act.DELETE_RESERVED_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
            });
        },
        [act.DELETE_RESERVED_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reservedError = payload;
            });
        },
        /**
         * 예약어 수정
         */
        [act.PUT_RESERVED_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reserved = body;
                draft.latestReservedSeq = body.reservedSeq;
                draft.reservedError = initialState.reservedError;
            });
        },
        [act.PUT_RESERVED_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = payload;
            });
        },
        /**
         * 데이터 clear
         */
        [act.CLEAR_RESERVED]: (state) => {
            return produce(state, (draft) => {
                draft.reserved = initialState.reserved;
                draft.reservedError = initialState.reservedError;
            });
        },
        [act.CLEAR_RESERVED_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 검색 옵션 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
    },
    initialState,
);
