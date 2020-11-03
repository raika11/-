import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/menu/menuAction';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    listLarge: [],
    listMiddle: [],
    listSmall: [],
    error: null,
    search: {
        parentMenuId: '00',
        useTotal: false,
    },
    menu: {},
    menuLarge: {},
    menuMiddle: {},
    menuSmall: {},
    selectedLargeId: null,
    selectedMiddleId: null,
    selectedSmallId: null,
    menuError: {},
    invalidList: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 데이터 변경
         */
        [act.CHANGE_MENU]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.menu = payload;
            });
        },

        [act.CHANGE_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.search = newSearch;
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
        [act.CLEAR_MENU]: (state) => {
            return produce(state, (draft) => {
                draft.menu = initialState.menu;
                draft.menuError = initialState.menuError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.listLarge = initialState.listLarge;
                draft.listMiddle = initialState.listMiddle;
                draft.listSmall = initialState.listSmall;
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
        [act.GET_MENU_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                if (typeof state.search.depth !== 'undefined') {
                    switch (Number(state.search.depth)) {
                        case 1:
                            draft.error = initialState.error;
                            draft.listLarge = body.list;
                            draft.listMiddle = initialState.listMiddle;
                            draft.listSmall = initialState.listSmall;
                            draft.total = body.totalCnt;
                            break;
                        case 2:
                            draft.error = initialState.error;
                            draft.listMiddle = body.list;
                            draft.listSmall = initialState.listSmall;
                            draft.total = body.totalCnt;
                            break;
                        case 3:
                            draft.error = initialState.error;
                            draft.listSmall = body.list;
                            draft.total = body.totalCnt;
                            break;
                        default:
                            draft.error = initialState.error;
                            draft.list = body.list;
                            draft.total = body.totalCnt;
                            break;
                    }
                }
            });
        },
        [act.GET_MENU_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },

        /**
         * 조회, 등록, 수정
         */
        [act.GET_MENU_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.menu = body;
                draft.menuError = initialState.menuError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_MENU_FAILURE]: (state, { payload }) => {
            const { body } = payload;

            return produce(state, (draft) => {
                draft.menu = initialState.menu;
                draft.menuError = payload;
                draft.invalidList = body;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_MENU_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.menu = initialState.menu;
                draft.menuError = initialState.menuError;
            });
        },
        [act.DELETE_MENU_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.menuError = payload;
            });
        },
    },
    initialState,
);
