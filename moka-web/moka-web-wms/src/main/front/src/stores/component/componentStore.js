import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'componentStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'componentStore/CHANGE_SEARCH_OPTIONS';
export const CHANGE_EDIT_ALL = 'componentStore/CHANGE_EDIT_ALL';
export const CHANGE_EDITS = 'componentStore/CHANGE_EDITS';
export const CHANGE_INVALID_LIST = 'componentStore/CHANGE_INVALID_LIST';
export const CLEAR_COMPONENT = 'componentStore/CLEAR_COMPONENT';
export const CLEAR_COMPONENT_LIST = 'componentStore/CLEAR_COMPONENT_LIST';
export const CLEAR_COMPONENT_DETAIL = 'componentStore/CLEAR_COMPONENT_DETAIL';
export const CLEAR_SEARCH_OPTION = 'componentStore/CLEAR_SEARCH_OPTION';
export const [
    GET_COMPONENTS,
    GET_COMPONENTS_SUCCESS,
    GET_COMPONENTS_FAILURE
] = createRequestActionTypes('componentStore/GET_COMPONENTS');
export const [
    GET_COMPONENT,
    GET_COMPONENT_SUCCESS,
    GET_COMPONENT_FAILURE
] = createRequestActionTypes('componentStore/GET_COMPONENT');
export const SAVE_COMPONENT = 'componentStore/SAVE_COMPONENT';
export const COPY_COMPONENT = 'componentStore/COPY_COMPONENT';
export const POST_ALL_COMPONENTS = 'componentStore/POST_ALL_COMPONENTS';
export const HAS_RELATIONS = 'componentStore/HAS_RELATIONS';
export const [
    DELETE_COMPONENT,
    DELETE_COMPONENT_SUCCESS,
    DELETE_COMPONENT_FAILURE
] = createRequestActionTypes('componentStore/DELETE_COMPONENT');

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const changeEditAll = createAction(CHANGE_EDIT_ALL, (payload) => payload);
export const changeEdits = createAction(CHANGE_EDITS, (...payload) => payload);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (payload) => payload);
export const clearComponent = createAction(CLEAR_COMPONENT, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const getComponents = createAction(GET_COMPONENTS, (...actions) => actions);
export const getComponent = createAction(GET_COMPONENT, (payload) => payload);
export const saveComponent = createAction(SAVE_COMPONENT, (payload) => payload);
export const copyComponent = createAction(COPY_COMPONENT, (payload) => payload);
export const postAllComponents = createAction(POST_ALL_COMPONENTS, (payload) => payload);
export const hasRelations = createAction(HAS_RELATIONS, (payload) => payload);
export const deleteComponent = createAction(DELETE_COMPONENT, (payload) => payload);

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: undefined,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'componentSeq,desc',
        domainId: undefined,
        tpZone: 'all',
        searchType: 'all',
        keyword: ''
    },
    detail: {},
    detailError: {},
    edit: {
        inputTag: ''
    },
    invalidList: []
};

/**
 * reducer
 */
const componentStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CHANGE_SEARCH_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.search[obj.key] = obj.value;
                }
            });
        },
        [CHANGE_EDITS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.edit[obj.key] = obj.value;
                }
            });
        },
        [CHANGE_EDIT_ALL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.edit = payload;
            });
        },
        [CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        [CLEAR_COMPONENT_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        },
        [CLEAR_COMPONENT_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detaliError;
                draft.detail = initialState.detail;
                draft.edit = initialState.edit;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 검색 조건 초기화
         */
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 컴포넌트 목록 조회
         */
        [GET_COMPONENTS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_COMPONENTS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 컴포넌트 조회/저장 결과
         */
        [GET_COMPONENT_SUCCESS]: (state, { payload: { body } }) => {
            let editable = {};
            editable.inputTag = `<mte:cp id="${body.componentSeq}" name="${body.componentName}" />`;
            Object.keys(body).forEach((key) => {
                if (body[key] !== undefined && body[key] !== null) {
                    if (key === 'domain') {
                        editable.domainId = body.domain.domainId;
                    } else if (key === 'template') {
                        editable.templateSeq = body.template.templateSeq;
                        editable.templateName = body.template.templateName;
                        editable.templateGroupName = body.template.templateGroupName;
                    } else if (key === 'dataset') {
                        editable.datasetSeq = body.dataset.datasetSeq;
                        editable.datasetName = body.dataset.datasetName;
                    } else if (key === 'previousEditDataset' || key === 'previousAutoDataset') {
                        // 아무것도 안함
                    } else {
                        editable[key] = body[key];
                    }
                }
            });
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = body;
                draft.edit = editable;
            });
        },
        [GET_COMPONENT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
                draft.detail = initialState.detail;
            });
        },
        /**
         * 삭제
         */
        [DELETE_COMPONENT_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = initialState.detail;
                draft.edit = initialState.edit;
            });
        }
    },
    initialState
);

export default componentStore;
