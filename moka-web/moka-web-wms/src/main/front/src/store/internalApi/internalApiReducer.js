import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './internalApiAction';
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
        usedYn: 'all',
        apiMethod: 'GET',
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'apiName', name: 'API명' },
        { id: 'apiPath', name: '경로' },
        { id: 'apiDesc', name: '설명' },
    ],
    apiMethodList: [
        { id: 'all', name: 'HTTP메소드 전체' },
        { id: 'GET', name: 'GET' },
        { id: 'POST', name: 'POST' },
        { id: 'PUT', name: 'PUT' },
        { id: 'DELETE', name: 'DELETE' },
    ],
    usedYnList: [
        { id: 'all', name: '사용 전체' },
        { id: 'Y', name: '사용' },
        { id: 'N', name: '미사용' },
    ],
    internalApi: {
        paramDesc: null,
        usedYn: 'Y',
        apiName: '',
        apiPath: '',
    },
    defaultParam: {
        name: '',
        desc: '',
        required: 'N',
        dataType: 'string',
    },
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
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_INTERNAL_API]: (state) => {
            return produce(state, (draft) => {
                draft.internalApi = initialState.internalApi;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 조회
         */
        [act.GET_INTERNAL_API_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.total = body.totalCnt;
                draft.list = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_INTERNAL_API_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = initialState.totalCnt;
                draft.list = initialState.list;
                draft.error = payload;
            });
        },
        [act.GET_INTERNAL_API_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.internalApi = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_INTERNAL_API_FAILURE]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.invalidList = body.list;
            });
        },
    },
    initialState,
);
