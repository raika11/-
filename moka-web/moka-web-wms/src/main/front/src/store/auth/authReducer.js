import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    CHANGE_DOMAIN_SEARCH_OPTION,
    CHANGE_LATEST_DOMAINID,
    CHANGE_LATEST_MEDIAID_RESULT,
    GET_DOMAINS_FAILURE,
    GET_DOMAINS_SUCCESS,
    GET_MEDIAS_FAILURE,
    GET_MEDIAS_SUCCESS,
    GET_MENU_FAILURE,
    GET_MENU_SUCCESS,
    SET_THEME,
} from './authAction';
import { getLocalItem } from '@utils/storageUtil';

/**
 * initialState
 */
const initialState = {
    latestDomainId: undefined,
    latestMediaId: undefined,
    domainSearch: {
        mediaId: '',
        page: 0,
        size: 100,
        sort: 'domainId,asc',
    },
    menu: [],
    medias: [],
    domains: [],
    theme: getLocalItem('wmsTheme') || 'SSC',
};

/**
 * reducer
 */
const authReducer = handleActions(
    {
        [GET_MENU_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.menu = body;
            });
        },
        [GET_MENU_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.menu = initialState.menu;
            });
        },
        [GET_DOMAINS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.domains = body.list;
            });
        },
        [GET_DOMAINS_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.domains = initialState.domains;
            });
        },
        [CHANGE_DOMAIN_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.domainSearch[key] = value;
            });
        },
        [CHANGE_LATEST_DOMAINID]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.latestDomainId = payload;
            });
        },
        [CHANGE_LATEST_MEDIAID_RESULT]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.latestMediaId = payload;
            });
        },
        [SET_THEME]: (state, { payload }) => ({
            ...state,
            theme: payload,
        }),
    },
    initialState,
);

export default authReducer;
