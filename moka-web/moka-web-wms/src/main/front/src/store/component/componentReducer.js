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
            console.log(payload);
            return produce(state, (draft) => {
                draft.search = payload;
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
