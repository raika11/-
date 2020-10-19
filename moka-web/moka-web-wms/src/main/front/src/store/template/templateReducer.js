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
        templateGroup: null,
        templateWidth: null,
        searchType: 'all',
        keyword: '',
    },
    template: {},
    templateError: null,
    templateBody: '',
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [act.CHANGE_SEARCH_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.search[obj.key] = obj.value;
                }
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_TEMPLATE]: () => initialState,
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
                draft.templateError = initialState.templateError;
            });
        },
        [act.GET_TEMPLATE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.template = initialState.template;
                draft.templateBody = initialState.templateBody;
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
    },
    initialState,
);
