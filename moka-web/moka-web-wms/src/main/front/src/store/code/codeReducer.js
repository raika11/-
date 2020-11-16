import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './codeAction';

/**
 * initialState
 */
export const initialState = {
    // 대분류
    service: {
        error: null,
        list: [],
        search: {
            searchType: 'parentCode',
            usedYn: 'Y',
        },
    },
    // 중분류
    section: {
        error: null,
        list: [],
        search: {
            searchType: 'parentCode',
            keyword: '',
            usedYn: 'Y',
        },
    },
    // 소분류
    content: {
        error: null,
        list: [],
        search: {
            searchType: 'parentCode',
            keyword: '',
            usedYn: 'Y',
        },
    },
    // korname으로 검색한 결과를 받는 store
    korname: {
        error: null,
        list: [],
        search: {
            searchType: 'korname',
            keyword: '',
            usedYn: 'Y',
        },
    },
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SECTION_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.section.search = payload;
            });
        },
        [act.CHANGE_CONTENT_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.content.search = payload;
            });
        },
        [act.CHANGE_KORNAME_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.korname.search = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_SERVICE_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.service = initialState.service;
            });
        },
        [act.CLEAR_SECTION_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.section = initialState.section;
            });
        },
        [act.CLEAR_CONTENT_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.content = initialState.content;
            });
        },
        /**
         * 데이터 조회
         */
        /** 대분류 */
        [act.GET_CODE_SERVICE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.service.list = body.list;
                draft.service.error = initialState.service.error;
            });
        },
        [act.GET_CODE_SERVICE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.service.list = initialState.service.list;
                draft.service.error = payload;
            });
        },
        /** 중분류 */
        [act.GET_CODE_SECTION_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.section.list = body.list;
                draft.section.error = initialState.section.error;
            });
        },
        [act.GET_CODE_SECTION_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.section.list = initialState.section.list;
                draft.section.error = payload;
            });
        },
        /** 소분류 */
        [act.GET_CODE_CONTENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.content.list = body.list;
                draft.content.error = initialState.content.error;
            });
        },
        [act.GET_CODE_CONTENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.content.list = initialState.content.list;
                draft.content.error = payload;
            });
        },
        /** korname 검색 리스트 */
        [act.GET_CODE_KORNAME_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.korname.list = body.list;
                draft.korname.error = initialState.korname.error;
            });
        },
        [act.GET_CODE_KORNAME_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.korname.list = initialState.korname.list;
                draft.korname.error = payload;
            });
        },
    },
    initialState,
);
