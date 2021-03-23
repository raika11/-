import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './columnistAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        status: '',
        keyword: '',
    },
    columnist: {
        seqNo: '',
        repNo: '',
        status: 'Y',
        repSeq: '',
        columnistNm: '',
        email: '',
        email1: '',
        email2: '',
        position: '',
        profilePhoto: '',
        profile: '',
        selectImg: '',
    },
    columnistError: null,
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
        [act.CLEAR_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_COLUMNIST]: (state) => {
            return produce(state, (draft) => {
                draft.columnist = initialState.columnist;
            });
        },
        /**
         * 스토어 데이터 변경
         */
        [act.CHANGE_COLUMNIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnist = payload;
            });
        },
        [act.CHANGE_INVALID_LINK]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 리스트 데이터 조회
         */
        [act.GET_COLUMNIST_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_COLUMNIST_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 정보 조회
         */
        [act.GET_COLUMNIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.columnist = body;
                draft.columnistError = initialState.directLinkError;
            });
        },
        [act.GET_COLUMNIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnistError = payload;
            });
        },
    },
    initialState,
);
