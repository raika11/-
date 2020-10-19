import { handleActions } from 'redux-actions';
import produce from 'immer';
import { CHANGE_DOMAIN_SEARCH_OPTION, CHANGE_LATEST_DOMAINID, GET_DOMAIN_LIST_FAILURE, GET_DOMAIN_LIST_SUCCESS, GET_MENU_FAILURE, GET_MENU_SUCCESS } from './authAction';

/**
 * initialState
 */
const initialState = {
    latestDomainId: null,
    domainList: [],
    domainSearch: {
        page: 0,
        size: 100,
        sort: 'domainId,asc',
    },
    menu: [],
};

/**
 * reducer
 */
export default handleActions(
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
        [GET_DOMAIN_LIST_FAILURE]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.domainList = body.list;
            });
        },
        [GET_DOMAIN_LIST_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.domainList = initialState.domainList;
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
    },
    initialState,
);
