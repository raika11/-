import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './authAction';

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
        [act.GET_USER_MENU_TREE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.menu = body;
            });
        },
        [act.GET_USER_MENU_TREE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.menu = initialState.menu;
            });
        },
        /**
         * 도메인 목록 조회
         */
        [act.GET_DOMAIN_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.domainList = body.list;
            });
        },
        [act.GET_DOMAIN_LIST_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.domainList = initialState.domainList;
            });
        },
        [act.CHANGE_DOMAIN_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.domainSearch[key] = value;
            });
        },
        [act.CHANGE_LATEST_DOMAINID]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.latestDomainId = payload;
            });
        },
    },
    initialState,
);
