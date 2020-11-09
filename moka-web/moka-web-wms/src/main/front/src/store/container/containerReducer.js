import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './containerAction';
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
        sort: 'containerSeq,desc',
        domainId: null,
        searchType: 'all',
        keyword: '',
        usePaging: 'Y',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'containerSeq', name: '컨테이너ID' },
        { id: 'containerName', name: '컨테이너명' },
        { id: 'templateBody', name: 'TEMS 소스' },
    ],
    lookup: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'containerSeq,desc',
            domainId: null,
            searchType: 'all',
            keyword: '',
        },
        container: {},
        containerError: null,
    },
    container: {},
    containerBody: '',
    containerError: null,
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
        [act.CLEAR_CONTAINER]: (state) => {
            return produce(state, (draft) => {
                draft.container = initialState.container;
                draft.containerBody = initialState.containerBody;
                draft.inputTag = initialState.inputTag;
                draft.containerError = initialState.containerError;
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
        [act.GET_CONTAINER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_CONTAINER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [act.GET_CONTAINER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.container = body;
                draft.containerBody = body.containerBody;
                draft.inputTag = `<tems:ct id="${body.containerSeq}" name="${body.containerName}" />`;
                draft.containerError = initialState.containerError;
            });
        },
        [act.GET_CONTAINER_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.containerError = payload;
            });
        },
        [act.GET_CONTAINER_LOOKUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.list = body.list;
                draft.lookup.total = body.totalCnt;
                draft.lookup.error = initialState.lookup.error;
            });
        },
        [act.GET_CONTAINER_LOOKUP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.list = initialState.lookup.list;
                draft.lookup.total = initialState.lookup.total;
                draft.lookup.error = payload;
            });
        },
        [act.GET_CONTAINER_LOOKUP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.lookup.container = body;
                draft.lookup.containerError = initialState.containerError;
            });
        },
        [act.GET_CONTAINER_LOOKUP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.lookup.containerError = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_CONTAINER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.container = payload;
            });
        },
        [act.CHANGE_CONTAINER_BODY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.containerBody = payload;
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
        [act.DELETE_CONTAINER_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.container = initialState.container;
                draft.inputTag = initialState.inputTag;
                draft.containerError = initialState.containerError;
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
