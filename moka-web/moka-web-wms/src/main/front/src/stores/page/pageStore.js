import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CLEAR_PAGE = 'pageStore/CLEAR_PAGE';
export const CHANGE_SEARCH_OPTION = 'pageStore/CHANGE_SEARCH_OPTION';
export const [
    GET_PAGE_TREE,
    GET_PAGE_TREE_SUCCESS,
    GET_PAGE_TREE_FAILURE
] = createRequestActionTypes('pageStore/GET_PAGE_TREE');
export const [GET_PAGE, GET_PAGE_SUCCESS, GET_PAGE_FAILURE] = createRequestActionTypes(
    'pageStore/GET_PAGE'
);
export const [POST_PAGE, POST_PAGE_SUCCESS, POST_PAGE_FAILURE] = createRequestActionTypes(
    'pageStore/POST_PAGE'
);
export const [PUT_PAGE, PUT_PAGE_SUCCESS, PUT_PAGE_FAILURE] = createRequestActionTypes(
    'pageStore/PUT_PAGE'
);
export const [DELETE_PAGE, DELETE_PAGE_SUCCESS, DELETE_PAGE_FAILURE] = createRequestActionTypes(
    'pageStore/DELETE_PAGE'
);
export const [GET_PURGE, GET_PURGE_SUCCESS, GET_PURGE_FAILURE] = createRequestActionTypes(
    'pageStore/GET_PURGE'
);
export const INSERT_SUB_PAGE = 'pageStore/INSERT_SUB_PAGE'; // 트리에서 서브 페이지 추가
export const CHANGE_FIELD = 'pageStore/CHANGE_FIELD';
export const APPEND_TAG = 'pageStore/APPEND_TAG';
export const CHANGE_PAGE_BODY = 'pageStore/CHANGE_PAGE_BODY';

/**
 * action creator
 */
export const clearPage = createAction(CLEAR_PAGE);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getPageTree = createAction(GET_PAGE_TREE, (searchOption) => searchOption);
export const getPage = createAction(GET_PAGE, ({ pageSeq, direct, callback }) => ({
    pageSeq,
    direct,
    callback
}));
export const postPage = createAction(POST_PAGE, ({ page, callback }) => ({
    page,
    callback
}));
export const putPage = createAction(PUT_PAGE, ({ page, callback }) => ({
    page,
    callback
}));
export const deletePage = createAction(DELETE_PAGE, ({ pageSeq, callback }) => ({
    pageSeq,
    callback
}));
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
    key,
    value
}));
export const insertSubPage = createAction(
    INSERT_SUB_PAGE,
    ({ parent, latestMediaId, latestDomainId, history }) => ({
        parent,
        latestMediaId,
        latestDomainId,
        history
    })
);
export const getPurge = createAction(GET_PURGE, (pageSeq) => pageSeq);
export const appendTag = createAction(APPEND_TAG, (tag) => tag);
export const changePageBody = createAction(CHANGE_PAGE_BODY, (pageBody) => pageBody);

/**
 * initial
 */
export const initialState = {
    pageTree: null,
    pageTreeError: null,
    search: {
        domainId: '',
        searchType: 'all',
        keyword: ''
    },
    latestPageSeq: null,
    page: {},
    pageError: null,
    parent: null,
    tag: null,
    pageBody: ''
};

export const defaultDomain = {
    domainId: null,
    mediaId: null,
    domainName: null,
    domainAddress: null,
    volumeId: null
};

export const defaultPage = {
    domain: {
        ...defaultDomain
    },
    pageSeq: null,
    pageServiceName: null,
    pageDisplayName: null,
    pageType: null,
    pageUrl: null,
    pageName: null,
    parent: {
        pageSeq: null,
        pageName: null,
        pageUrl: null
    },
    pageOrder: '1',
    keyword: null,
    description: null,
    useYn: 'Y',
    pageBody: '',
    moveYn: 'N',
    moveUrl: null
};

/**
 * reducer
 */
const pageStore = handleActions(
    {
        // clear
        [CLEAR_PAGE]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_PAGE_TREE_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            pageTree: body,
            pageTreeError: null,
            parent: null
        }),
        // 목록 조회 실패
        [GET_PAGE_TREE_FAILURE]: (state, { payload: pageTreeError }) => ({
            ...state,
            pageTree: null,
            pageTreeError,
            parent: null
        }),
        // 상세 조회 성공
        [GET_PAGE_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            page: body,
            latestPageSeq: body.pageSeq,
            pageError: null
        }),
        // 상세 조회 실패
        [GET_PAGE_FAILURE]: (state, { payload: pageError }) => ({
            ...state,
            pageError
        }),
        // 추가 성공
        [POST_PAGE_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            page: body,
            latestPageSeq: body.pageSeq,
            pageError: null
        }),
        // 추가 실패
        [POST_PAGE_FAILURE]: (state, { payload: pageError }) => ({
            ...state,
            pageError
        }),
        // 수정 성공
        [PUT_PAGE_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            page: body,
            latestPageSeq: body.pageSeq,
            pageError: null
        }),
        // 수정 실패
        [PUT_PAGE_FAILURE]: (state, { payload: pageError }) => ({
            ...state,
            pageError
        }),
        // 삭제 성공
        [DELETE_PAGE_SUCCESS]: (state) => ({
            ...state,
            page: {},
            pageError: null
        }),
        // 삭제 실패
        [DELETE_PAGE_FAILURE]: (state, { payload: pageError }) => ({
            ...state,
            pageError
        }),
        // 트리에서 서브 페이지 추가
        [INSERT_SUB_PAGE]: (state, { payload: { parent, latestMediaId, latestDomainId } }) => ({
            ...state,
            page: {
                ...defaultPage,
                domain: {
                    ...defaultDomain,
                    mediaId: latestMediaId,
                    domainId: latestDomainId
                },
                parent: {
                    ...parent
                },
                pageUrl: parent ? parent.pageUrl : null
            },
            latestPageSeq: null,
            pageError: null
        }),
        // PURGE 성공
        [GET_PURGE_SUCCESS]: (state) => ({
            ...state,
            pageError: null
        }),
        // PURGE 실패
        [GET_PURGE_FAILURE]: (state, { payload: pageError }) => ({
            ...state,
            pageError
        }),
        // 입력 필드
        [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
            produce(state, (draft) => {
                if (!draft.page) {
                    draft.page = { ...defaultPage };
                }
                draft.page[key] = value; // 예: state.dataset.datasetName을 바꾼다
            }),
        // 페이지 본문 수정
        [CHANGE_PAGE_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.pageBody = payload;
            });
        },
        // 태그추가
        [APPEND_TAG]: (state, { payload }) => ({
            ...state,
            tag: payload
        })
    },
    initialState
);

export default pageStore;
