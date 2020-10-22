import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/domain/domainAction';
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
        sort: 'domainId,asc',
    },
    domain: {},
    domainError: {},
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
        [act.CHANGE_DOMAIN]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.domain = payload;
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
        [act.CLEAR_DOMAIN]: (state) => {
            return produce(state, (draft) => {
                draft.domain = initialState.domain;
                draft.domainError = initialState.domainError;
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
        [act.GET_DOMAIN_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_DOMAIN_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_DOMAIN_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.domain = body;
                draft.domainError = initialState.domainError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_DOMAIN_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.domain = initialState.domain;
                draft.domainError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_DOMAIN_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.domain = initialState.domain;
                draft.domainError = initialState.domainError;
            });
        },
        [act.DELETE_DOMAIN_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.domainError = payload;
            });
        },
    },
    initialState,
);
