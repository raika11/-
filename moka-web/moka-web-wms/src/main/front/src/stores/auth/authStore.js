import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { getLocalItem } from '~/utils/storageUtil';

/**
 * action
 */

// 로그인
export const LOGIN_JWT = 'authStore/loginJwt';

// 로그아웃
export const LOGOUT = 'authStore/logout';

// 메뉴 조회
export const [GET_MENU, GET_MENU_SUCCESS, GET_MENU_FAILURE] = createRequestActionTypes(
    'authStore/GET_MENU'
);

// 매체 조회
export const [GET_MEDIAS, GET_MEDIAS_SUCCESS, GET_MEDIAS_FAILURE] = createRequestActionTypes(
    'authStore/GET_MEDIAS'
);

// 매체에 따른 도메인 조회
export const [GET_DOMAINS, GET_DOMAINS_SUCCESS, GET_DOMAINS_FAILURE] = createRequestActionTypes(
    'authStore/GET_DOMAINS'
);
export const CHANGE_DOMAIN_SEARCH_OPTION = 'authStore/CHANGE_DOMAIN_SEARCH_OPTION';

// 오픈 중인 domainId, mediaId 공유
export const CHANGE_LATEST_DOMAINID = 'authStore/CHANGE_LATEST_DOMAINID';
export const CHANGE_LATEST_MEDIAID_RESULT = 'authStore/CHANGE_LATEST_MEDIAID_RESULT';
export const CHANGE_LATEST_MEDIAID = 'authStore/CHANGE_LATEST_MEDIAID';

// 개인 테마
export const SET_THEME = 'authStore/SET_THEME';

/**
 * action creator
 */
export const loginJwt = createAction(LOGIN_JWT);
export const logout = createAction(LOGOUT);
export const getMenu = createAction(GET_MENU);
export const getMedias = createAction(GET_MEDIAS);
export const getDomains = createAction(GET_DOMAINS, (payload) => payload);
export const changeDomainSearchOption = createAction(
    CHANGE_DOMAIN_SEARCH_OPTION,
    ({ key, value }) => ({ key, value })
);
export const changeLatestDomainId = createAction(CHANGE_LATEST_DOMAINID, (domainId) => domainId);
export const changeLatestMediaId = createAction(CHANGE_LATEST_MEDIAID, (payload) => payload);
export const setTheme = createAction(SET_THEME);

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
        sort: 'domainId,asc'
    },
    menu: [],
    medias: [],
    domains: [],
    theme: getLocalItem('wmsTheme') || 'SSC'
};

/**
 * reducer
 */
const authStore = handleActions(
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
        [GET_MEDIAS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.medias = body.list;
            });
        },
        [GET_MEDIAS_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.medias = initialState.medias;
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
            theme: payload
        })
    },
    initialState
);

export default authStore;
