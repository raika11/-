import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';
import * as act from './pageAction';

/**
 * initialState
 */
export const initialState = {
    error: null,
    tree: null,
    treeBySeq: {},
    findPage: [],
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
            page: 0,
            size: PAGESIZE_OPTIONS[0],
        },
        page: {},
        pageError: null,
    },
    page: {
        pageSeq: null,
        domain: {
            domainId: null,
            domainName: null,
            domainAddress: null,
        },
        pageName: '',
        pageServiceName: '',
        pageDisplayName: '',
        parent: {
            pageSeq: null,
            pageName: null,
            pageUrl: null,
        },
        pageType: null,
        pageUrl: '',
        pageOrd: 1,
        pageBody: '',
        urlParam: '',
        usedYn: 'Y',
        fileYn: 'N',
        kwd: null,
        description: '',
        moveYn: 'N',
        moveUrl: '',
    },
    pageError: null,
    pageBody: '',
    inputTag: '',
    invalidList: [],
};

const makeTreeBySeq = (list, treeBySeq) => {
    for (let i = 0; i < list.length; i++) {
        const node = list[i];
        treeBySeq[node.pageSeq] = node;
        if (node.nodes) {
            makeTreeBySeq(node.nodes, treeBySeq);
        }
    }
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
                draft.treeBySeq = initialState.treeBySeq;
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
            const { tree, findPage } = body;
            const treeBySeq = {};
            makeTreeBySeq([tree], treeBySeq);

            return produce(state, (draft) => {
                draft.tree = tree;
                draft.treeBySeq = treeBySeq;
                draft.findPage = findPage;
                draft.error = initialState.error;
            });
        },
        [act.GET_PAGE_TREE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.tree = initialState.tree;
                draft.treeBySeq = initialState.treeBySeq;
                draft.findPage = initialState.findPage;
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
        [act.GET_PAGE_LOOKUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.page = body;
                draft.lookup.pageError = initialState.pageError;
            });
        },
        [act.GET_PAGE_LOOKUP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.page = initialState.page;
                draft.lookup.pageError = payload;
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
         * 트리에서 서브 페이지 추가
         */
        [act.INSERT_SUB_PAGE]: (state, { payload: { parent, latestDomainId } }) => {
            return produce(state, (draft) => {
                let pageUrl = parent?.pageUrl || '';
                draft.page = {
                    ...initialState.page,
                    domain: { ...initialState.page.domain, domainId: latestDomainId },
                    parent,
                    pageUrl: pageUrl.slice(-1) === '/' ? pageUrl : `${pageUrl}/`,
                };
                draft.pageError = initialState.pageError;
                draft.pageBody = initialState.pageBody;
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
