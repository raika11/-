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
        sort: 'pageSeq,asc',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'pageSeq', name: '페이지ID' },
        { id: 'pageName', name: '페이지명' },
        { id: 'pageServiceName', name: '서비스명' },
        { id: 'pageBody', name: 'TEMS 소스' },
    ],
    lookup: {
        total: 0,
        error: null,
        list: [],
        search: {
            domainId: null,
            searchType: 'all',
            keyword: '',
        },
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
        pageType: null,
        pageUrl: null,
        pageOrd: 1,
        pageBody: '',
        urlParam: null,
        usedYn: 'Y',
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
        [act.CHANGE_LOOKUP_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.search = payload;
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
        [act.CLEAR_LOOKUP]: (state) => {
            return produce(state, (draft) => {
                draft.lookup = initialState.lookup;
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
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_PAGE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.page = initialState.page;
                draft.pageBody = initialState.pageBody;
                draft.inputTag = initialState.inputTag;
                draft.pageError = payload;
                draft.invalidList = payload.body ? payload.body : initialState.invalidList;
            });
        },
        [act.GET_PAGE_LOOKUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.list = body.list;
                draft.lookup.total = body.totalCnt;
                draft.lookup.error = initialState.lookup.error;
            });
        },
        [act.GET_PAGE_LOOKUP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.list = initialState.lookup.list;
                draft.lookup.total = initialState.lookup.total;
                draft.lookup.error = payload;
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
            pageBody: initialState.pageBody,
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
        /**
         * 태그추가
         */
        [act.APPEND_TAG]: (state, { payload }) => ({
            ...state,
            inputTag: payload,
        }),
    },
    initialState,
);
