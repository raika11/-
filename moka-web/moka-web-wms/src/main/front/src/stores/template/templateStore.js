import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'templateStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'templateStore/CHANGE_SEARCH_OPTIONS';
export const CHANGE_TEMPLATE_BODY = 'templateStore/CHANGE_TEMPLATE_BODY';
export const CHANGE_LIST_TYPE = 'templateStore/CHANGE_LIST_TYPE';
export const CHANGE_EDIT = 'templateStore/CHANGE_EDIT';
export const CHANGE_EDIT_ALL = 'templateStore/CHANGE_EDIT_ALL';
export const CLEAR_TEMPLATE = 'templateStore/CLEAR_TEMPLATE';
export const CLEAR_TEMPLATE_LIST = 'templateStore/CLEAR_TEMPLATE_LIST';
export const CLEAR_TEMPLATE_DETAIL = 'templateStore/CLEAR_TEMPLATE_DETAIL';
export const CLEAR_SEARCH_OPTION = 'templateStore/CLEAR_SEARCH_OPTION';
export const HAS_RELATIONS = 'templateStore/HAS_RELATIONS';
export const COPY_TEMPLATE = 'templateStore/COPY_TEMPLATE';
export const [
    GET_TEMPLATES,
    GET_TEMPLATES_SUCCESS,
    GET_TEMPLATES_FAILURE
] = createRequestActionTypes('templateStore/GET_TEMPLATES');
export const [GET_TEMPLATE, GET_TEMPLATE_SUCCESS, GET_TEMPLATE_FAILURE] = createRequestActionTypes(
    'templateStore/GET_TEMPLATE'
);
export const SAVE_TEMPLATE = 'templateStore/SAVE_TEMPLATE';
export const DELETE_TEMPLATE = 'templateStore/DELETE_TEMPLATE';
export const DELETE_TEMPLATE_SUCCESS = 'templateStore/DELETE_TEMPLATE_SUCCESS';

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const changeTemplateBody = createAction(CHANGE_TEMPLATE_BODY, (payload) => payload);
export const changeListType = createAction(CHANGE_LIST_TYPE, (payload) => payload);
export const clearTemplate = createAction(CLEAR_TEMPLATE, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const changeEdit = createAction(CHANGE_EDIT);
export const changeEditAll = createAction(CHANGE_EDIT_ALL);
export const hasRelations = createAction(HAS_RELATIONS);
export const copyTemplate = createAction(COPY_TEMPLATE);
export const getTemplates = createAction(GET_TEMPLATES, (...actions) => actions);
export const getTemplate = createAction(GET_TEMPLATE, (payload) => payload);
export const saveTemplate = createAction(SAVE_TEMPLATE, (payload = {}) => payload);
export const deleteTemplate = createAction(DELETE_TEMPLATE, (payload) => payload);

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
        sort: 'templateSeq,desc',
        widthMin: undefined,
        widthMax: undefined,
        domainId: 'all',
        tpZone: 'all',
        tpSize: 'all',
        searchType: 'all',
        keyword: ''
    },
    listType: 'list',
    detail: {
        templateGroup: 'TP_ZONE1',
        inputTag: ''
    },
    detailError: {},
    templateBody: ''
};

/**
 * reducer
 */
const templateStore = handleActions(
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
        [CHANGE_TEMPLATE_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.templateBody = payload;
            });
        },
        [CHANGE_LIST_TYPE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.listType = payload;
            });
        },
        [CHANGE_EDIT]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.detail[key] = value;
            });
        },
        [CHANGE_EDIT_ALL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detail = payload;
            });
        },
        [CLEAR_TEMPLATE_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        [CLEAR_TEMPLATE_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = initialState.detail;
                draft.templateBody = initialState.templateBody;
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
         * 목록
         */
        [GET_TEMPLATES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_TEMPLATES_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회
         */
        [GET_TEMPLATE_SUCCESS]: (state, { payload: { body } }) => {
            let templateData = { ...body };
            templateData.templateBody = undefined;
            templateData.inputTag = `<mte:tp id="${body.templateSeq}" name="${body.templateName}" />`;
            if (body.domain && body.domain !== null) {
                templateData.domainId = body.domain.domainId;
            }

            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = templateData;
                draft.templateBody = body.templateBody;
            });
        },
        [GET_TEMPLATE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
            });
        },
        /**
         * 삭제
         */
        [DELETE_TEMPLATE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = initialState.detail;
                draft.templateBody = initialState.templateBody;
            });
        }
    },
    initialState
);

export default templateStore;
