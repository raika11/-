import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
const CLEAR_CONTAINER = 'containerStore/CLEAR_CONTAINER';
export const CHANGE_SEARCH_OPTION = 'containerStore/CHANGE_SEARCH_OPTION';
export const [
    GET_CONTAINER_LIST,
    GET_CONTAINER_LIST_SUCCESS,
    GET_CONTAINER_LIST_FAILURE
] = createRequestActionTypes('containerStore/GET_CONTAINER_LIST');
export const [
    GET_CONTAINER,
    GET_CONTAINER_SUCCESS,
    GET_CONTAINER_FAILURE
] = createRequestActionTypes('containerStore/GET_CONTAINER');
export const [
    POST_CONTAINER,
    POST_CONTAINER_SUCCESS,
    POST_CONTAINER_FAILURE
] = createRequestActionTypes('containerStore/POST_CONTAINER');
export const [
    PUT_CONTAINER,
    PUT_CONTAINER_SUCCESS,
    PUT_CONTAINER_FAILURE
] = createRequestActionTypes('containerStore/PUT_CONTAINER');
export const [
    DELETE_CONTAINER,
    DELETE_CONTAINER_SUCCESS,
    DELETE_CONTAINER_FAILURE
] = createRequestActionTypes('containerStore/DELETE_CONTAINER');
export const CHANGE_FIELD = 'containerStore/CHANGE_FIELD';
export const APPEND_TAG = 'containerStore/APPEND_TAG';
export const INSERT_CONTAINER = 'containerStore/INSERT_CONTAINER';
export const HAS_RELATIONS = 'containerStore/HAS_RELATIONS';
export const CHANGE_CONTAINER_BODY = 'containerStore/CHANGE_PAGE_BODY';

/**
 * action creator
 */
export const clearContainer = createAction(CLEAR_CONTAINER);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getContainerList = createAction(GET_CONTAINER_LIST, (search) => search);
export const getContainer = createAction(GET_CONTAINER, ({ containerSeq, direct, callback }) => ({
    containerSeq,
    direct,
    callback
}));
export const postContainer = createAction(POST_CONTAINER, ({ container, callback }) => ({
    container,
    callback
}));
export const putContainer = createAction(PUT_CONTAINER, ({ container, callback }) => ({
    container,
    callback
}));
export const deleteContainer = createAction(DELETE_CONTAINER, ({ containerSeq, callback }) => ({
    containerSeq,
    callback
}));
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
    key,
    value
}));
export const appendTag = createAction(APPEND_TAG, (tag) => tag);
export const insertContainer = createAction(INSERT_CONTAINER, ({ latestDomainId }) => ({
    latestDomainId
}));
export const hasRelations = createAction(HAS_RELATIONS, ({ containerSeq, callback }) => ({
    containerSeq,
    callback
}));
export const changeContainerBody = createAction(
    CHANGE_CONTAINER_BODY,
    (containerBody) => containerBody
);

/**
 * initialState
 */
export const defaultContainer = {
    domain: null,
    containerSeq: null,
    containerName: null,
    containerBody: ''
};

export const initialState = {
    list: null,
    error: null,
    total: 0,
    search: {
        domainId: null,
        searchType: 'all',
        keyword: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'containerSeq,desc'
    },
    latestContainerSeq: null,
    container: defaultContainer,
    containerError: null,
    tag: null,
    containerBody: ''
};

/**
 * reducer
 */
const containerStore = handleActions(
    {
        // clear
        [CLEAR_CONTAINER]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_CONTAINER_LIST_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            list: body && body.list,
            total: body && body.totalCnt,
            error: null
        }),
        // 목록 조회 실패
        [GET_CONTAINER_LIST_FAILURE]: (state, { payload: error }) => ({
            ...state,
            list: null,
            error
        }),
        // 상세 조회 성공
        [GET_CONTAINER_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            container: body,
            latestContainerSeq: body.containerSeq,
            containerError: null
        }),
        // 상세 조회 실패
        [GET_CONTAINER_FAILURE]: (state, { payload: containerError }) => ({
            ...state,
            containerError
        }),
        // 추가 성공
        [POST_CONTAINER_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            container: body,
            latestContainerSeq: body.containerSeq,
            containerError: null
        }),
        // 추가 실패
        [POST_CONTAINER_FAILURE]: (state, { payload: containerError }) => ({
            ...state,
            containerError
        }),
        // 수정 성공
        [PUT_CONTAINER_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            container: body,
            latestContainerSeq: body.containerSeq,
            containerError: null
        }),
        // 수정 실패
        [PUT_CONTAINER_FAILURE]: (state, { payload: containerError }) => ({
            ...state,
            containerError
        }),
        // 삭제 성공
        [DELETE_CONTAINER_SUCCESS]: (state) => ({
            ...state,
            container: {},
            containerError: null
        }),
        // 삭제 실패
        [DELETE_CONTAINER_FAILURE]: (state, { payload: containerError }) => ({
            ...state,
            containerError
        }),
        // 입력 필드
        [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
            produce(state, (draft) => {
                if (!draft.container) {
                    draft.container = { ...defaultContainer };
                }
                draft.container[key] = value;
            }),
        // 컨테이너 본문 수정
        [CHANGE_CONTAINER_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.containerBody = payload;
            });
        },
        // 태그추가
        [APPEND_TAG]: (state, { payload }) => ({
            ...state,
            tag: payload
        }),
        // 추가
        [INSERT_CONTAINER]: (state, { payload: { latestDomainId } }) => ({
            ...state,
            container: {
                ...defaultContainer,
                domain: {
                    domainId: latestDomainId
                }
            },
            latestContainerSeq: null,
            containerError: null
        })
    },
    initialState
);

export default containerStore;
