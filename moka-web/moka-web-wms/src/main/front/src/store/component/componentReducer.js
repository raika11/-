import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './componentAction';
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
        sort: 'componentSeq,desc',
        domainId: null,
        templateGroup: 'all',
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'componentSeq', name: '컴포넌트ID' },
        { id: 'componentName', name: '컴포넌트명' },
        { id: 'templateSeq', name: '템플릿ID' },
        { id: 'templateName', name: '템플릿명' },
    ],
    lookup: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'componentSeq,desc',
            domainId: null,
            templateGroup: 'all',
            searchType: 'all',
            keyword: '',
        },
    },
    component: {
        domain: {},
        template: {},
        dataset: {},
        skin: {},
        dataType: 'NONE',
        periodYn: 'N',
        schServiceType: 'all',
        schLang: 'all',
        schCodeId: '',
        pagingYn: 'N',
        pagingType: 'N',
    },
    componentError: null,
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
        [act.CLEAR_COMPONENT]: (state) => {
            return produce(state, (draft) => {
                draft.component = initialState.component;
                draft.inputTag = initialState.inputTag;
                draft.componentError = initialState.componentError;
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
        [act.CLEAR_LOOKUP]: (state) => {
            return produce(state, (draft) => {
                draft.lookup = initialState.lookup;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_COMPONENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_COMPONENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_COMPONENT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.component = body;
                draft.inputTag = `<tems:cp id="${body.componentSeq}" name="${body.componentName}" />`;
                draft.componentError = initialState.componentError;
            });
        },
        [act.GET_COMPONENT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.componentError = payload;
            });
        },
        [act.GET_COMPONENT_LOOKUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.list = body.list;
                draft.lookup.total = body.totalCnt;
                draft.lookup.error = initialState.lookup.error;
            });
        },
        [act.GET_COMPONENT_LOOKUP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.list = initialState.lookup.list;
                draft.lookup.total = initialState.lookup.total;
                draft.lookup.error = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_COMPONENT]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.component = payload;
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
        [act.DELETE_COMPONENT_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.component = initialState.component;
                draft.inputTag = initialState.inputTag;
                draft.componentError = initialState.componentError;
            });
        },
    },
    initialState,
);
