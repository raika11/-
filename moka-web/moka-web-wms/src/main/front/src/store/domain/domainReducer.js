import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    CHANGE_SEARCH_OPTION,
    CLEAR_DOMAIN,
    CLEAR_DOMAIN_DETAIL,
    CLEAR_DOMAIN_LIST,
    CLEAR_SEARCH_OPTION,
    DELETE_DOMAIN_FAILURE,
    DELETE_DOMAIN_SUCCESS,
    GET_DOMAIN_FAILURE,
    GET_DOMAIN_SUCCESS,
    GET_DOMAINS_FAILURE,
    GET_DOMAINS_SUCCESS,
} from '@store/domain/domainAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
const initialState = {
    error: undefined,
    list: [],
    total: 0,
    search: {
        mediaId: undefined,
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'domainId,asc',
    },
    detail: {},
    detailError: {},
};

/**
 * reducer
 */
const domainReducer = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        [CLEAR_DOMAIN_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        },
        [CLEAR_DOMAIN_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.detail = initialState.detail;
                draft.detailError = initialState.detailError;
            });
        },
        [CLEAR_DOMAIN]: (state) => {
            return produce(state, (draft) => {
                draft.detail = initialState.detail;
                draft.detailError = initialState.detailError;
            });
        },
        /**
         * 목록
         */
        [GET_DOMAINS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_DOMAINS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [GET_DOMAIN_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = body;
            });
        },
        [GET_DOMAIN_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
                draft.detail = initialState.detail;
            });
        },
        /**
         * 삭제
         */
        [DELETE_DOMAIN_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = initialState.detail;
            });
        },
        [DELETE_DOMAIN_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
            });
        },
    },
    initialState,
);

export default domainReducer;
