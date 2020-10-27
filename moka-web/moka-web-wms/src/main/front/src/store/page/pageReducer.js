import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './pageAction';

/**
 * initialState
 */
export const initialState = {
    error: null,
    tree: null,
    search: {
        domainId: null,
        searchType: 'all',
        keyword: '',
    },
    page: {},
    pageError: null,
    pageBody: '',
    inputTag: '',
    invalidList: [],
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_PAGE]: (state) => {
            return produce(state, (draft) => {
                draft.page = initialState.page;
                draft.pageBody = initialState.pageBody;
                draft.inputTag = initialState.inputTag;
                draft.pageError = initialState.pageError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_TREE]: (state) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_PAGE_TREE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.tree = body;
                draft.error = initialState.error;
            });
        },
        [act.GET_PAGE_TREE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.error = payload;
            });
        },
        [act.GET_PAGE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.page = body;
                draft.pageBody = body.pageBody;
                draft.inputTag = initialState.inputTag;
                draft.pageError = initialState.pageError;
            });
        },
        [act.GET_PAGE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.page = initialState.page;
                draft.pageBody = initialState.pageBody;
                draft.inputTag = initialState.inputTag;
                draft.pageError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_PAGE_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.pageBody = payload;
            });
        },
        [act.CHANGE_PAGE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.page = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 데이터 삭제
         */
        [act.DELETE_PAGE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.page = initialState.page;
                draft.pageBody = initialState.pageBody;
                draft.inputTag = initialState.inputTag;
                draft.pageError = initialState.pageError;
            });
        },
    },
    initialState,
);
