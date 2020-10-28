import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './pageAction';
import { PAGE_TYPE_HTML } from '@/constants';

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
    page: {
        pageSeq: null,
        domain: {
            domainId: null,
            domainName: null,
            domainAddress: null,
        },
        pageName: null,
        pageServiceName: null,
        pageDisplayName: null,
        parent: {
            pageSeq: null,
            pageName: null,
            pageUrl: null,
        },
        pageType: PAGE_TYPE_HTML,
        pageUrl: null,
        pageOrd: 1,
        pageBody: '',
        urlParam: '',
        useYn: 'Y',
        fileYn: 'N',
        kwd: null,
        description: null,
        moveYn: 'N',
        moveUrl: null,
    },
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
        // 트리에서 서브 페이지 추가
        [act.INSERT_SUB_PAGE]: (state, { payload: { parent, latestDomainId } }) => ({
            ...state,
            page: {
                ...initialState.page,
                domain: {
                    ...initialState.page.domain,
                    domainId: latestDomainId,
                },
                parent: {
                    ...parent,
                },
                pageUrl: parent ? parent.pageUrl : null,
            },
            pageError: null,
        }),
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
