import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { PAGESIZE_OPTIONS } from '~/constants';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'domainStore/CHANGE_SEARCH_OPTION';
export const CLEAR_SEARCH_OPTION = 'domainStore/CLEAR_SEARCH_OPTION';
export const CLEAR_DOMAIN = 'domainStore/CLEAR_DOMAIN';
export const CLEAR_DOMAIN_LIST = 'domainStore/CLEAR_DOMAIN_LIST';
export const CLEAR_DOMAIN_DETAIL = 'domainStore/CLEAR_DOMAIN_DETAIL';
export const DUPLICATE_CHECK = 'domainStore/DUPLICATE_CHECK';
export const [GET_DOMAINS, GET_DOMAINS_SUCCESS, GET_DOMAINS_FAILURE] = createRequestActionTypes(
    'domainStore/GET_DOMAINS'
);
export const [GET_DOMAIN, GET_DOMAIN_SUCCESS, GET_DOMAIN_FAILURE] = createRequestActionTypes(
    'domainStore/GET_DOMAIN'
);
export const SAVE_DOMAIN = 'domainStore/SAVE_DOMAIN';
export const HAS_RELATIONS = 'domainStore/HAS_RELATIONS';
export const [
    DELETE_DOMAIN,
    DELETE_DOMAIN_SUCCESS,
    DELETE_DOMAIN_FAILURE
] = createRequestActionTypes('domainStore/DELETE_DOMAIN');

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const clearDomain = createAction(CLEAR_DOMAIN, (payload) => payload);
export const clearDomainList = createAction(CLEAR_DOMAIN_LIST);
export const clearDomainDetail = createAction(CLEAR_DOMAIN_DETAIL);
export const duplicateCheck = createAction(DUPLICATE_CHECK, (payload) => payload);
export const getDomains = createAction(GET_DOMAINS, (...actions) => actions);
export const getDomain = createAction(GET_DOMAIN, (payload) => payload);
export const saveDomain = createAction(SAVE_DOMAIN, (payload) => payload);
export const hasRelations = createAction(HAS_RELATIONS, (payload) => payload);
export const deleteDomain = createAction(DELETE_DOMAIN, (payload) => payload);

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
        sort: 'domainId,asc'
    },
    detail: {},
    detailError: {}
};

/**
 * reducer
 */
const domainStore = handleActions(
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
        }
    },
    initialState
);

export default domainStore;
