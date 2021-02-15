import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articlePageAction';

/**
 * initialState
 */
export const initialState = {
    error: null,
    list: null,
    total: 0,
    search: {
        domainId: null,
        searchType: 'all',
        sort: 'artPageSeq,asc',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'artPageSeq', name: '기사페이지ID' },
        { id: 'artPageName', name: '기사페이지명' },
        { id: 'artPageBody', name: 'TEMS 소스' },
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
        articlePage: {},
        articlePageError: null,
    },
    articlePage: {
        artPageSeq: null,
        domain: {
            domainId: null,
            domainName: null,
            domainAddress: null,
        },
        artPageName: '',
        artType: 'B',
        artPageBody: '',
    },
    articlePageError: null,
    artPageBody: '',
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
        [act.CLEAR_ARTICLE_PAGE]: (state) => {
            return produce(state, (draft) => {
                draft.articlePage = initialState.articlePage;
                draft.artPageBody = initialState.artPageBody;
                draft.inputTag = initialState.inputTag;
                draft.articlePageError = initialState.articlePageError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_ARTICLE_PAGE_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
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
        [act.GET_ARTICLE_PAGE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_ARTICLE_PAGE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_ARTICLE_PAGE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.articlePage = body;
                draft.artPageBody = body.artPageBody;
                draft.inputTag = initialState.inputTag;
                draft.articlePageError = initialState.articlePageError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_ARTICLE_PAGE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.articlePage = initialState.articlePage;
                draft.artPageBody = initialState.artPageBody;
                draft.inputTag = initialState.inputTag;
                draft.articlePageError = payload;
            });
        },
        [act.GET_ARTICLE_PAGE_LOOKUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.list = body.list;
                draft.lookup.total = body.totalCnt;
                draft.lookup.error = initialState.lookup.error;
            });
        },
        [act.GET_ARTICLE_PAGE_LOOKUP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.list = initialState.lookup.list;
                draft.lookup.total = initialState.lookup.total;
                draft.lookup.error = payload;
            });
        },
        [act.GET_ARTICLE_PAGE_LOOKUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.articlePage = body;
                draft.lookup.articlePageError = initialState.articlePageError;
            });
        },
        [act.GET_ARTICLE_PAGE_LOOKUP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.articlePage = initialState.articlePage;
                draft.lookup.articlePageError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_ARTICLE_PAGE_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.artPageBody = payload;
            });
        },
        [act.CHANGE_ARTICLE_PAGE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.articlePage = payload;
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
        [act.DELETE_ARTICLE_PAGE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.articlePage = initialState.articlePage;
                draft.artPageBody = initialState.artPageBody;
                draft.inputTag = initialState.inputTag;
                draft.articlePageError = initialState.articlePageError;
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
