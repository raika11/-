import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './templateAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'templateSeq,desc',
        domainId: null,
        templateGroup: 'all',
        widthMin: null,
        widthMax: null,
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'templateSeq', name: '템플릿ID' },
        { id: 'templateName', name: '템플릿명' },
        { id: 'templateBody', name: 'TEMS 소스' },
    ],
    template: {},
    templateError: null,
    templateBody: '',
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
        [act.CLEAR_TEMPLATE]: (state) => {
            return produce(state, (draft) => {
                draft.template = initialState.template;
                draft.templateBody = initialState.templateBody;
                draft.inputTag = initialState.inputTag;
                draft.templateError = initialState.templateError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
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
        [act.GET_TEMPLATE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_TEMPLATE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_TEMPLATE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.template = body;
                draft.templateBody = body.templateBody;
                draft.inputTag = `<tems:tp id="${body.templateSeq}" name="${body.templateName}" />`;
                draft.templateError = initialState.templateError;
            });
        },
        [act.GET_TEMPLATE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.template = initialState.template;
                draft.templateBody = initialState.templateBody;
                draft.inputTag = initialState.inputTag;
                draft.templateError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_TEMPLATE_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.templateBody = payload;
            });
        },
        [act.CHANGE_TEMPLATE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.template = payload;
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
        [act.DELETE_TEMPLATE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.template = initialState.template;
                draft.templateBody = initialState.templateBody;
                draft.inputTag = initialState.inputTag;
                draft.templateError = initialState.templateError;
            });
        },
    },
    initialState,
);
