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
        searchType: '',
        status: '',
        keyword: '',
    },
    statusSearchTypeList: [
        { name: '사용여부 전체', id: '' },
        { name: '사용', id: 'Y' },
        { name: '미사용', id: 'N' },
    ],
    columnist: {
        columnistNm: '',
        email: '',
        inout: '',
        jplusRepDiv: '',
        jplusRepDivNm: '',
        modDt: '',
        modId: '',
        position: '',
        profile: '',
        profilePhoto: '',
        regDt: '',
        regId: '',
        regNm: '',
        repSeq: '',
        seqNo: '',
        status: 'Y',
        email1: '',
        email2: '',
        selectImg: '',
    },
    columnistError: null,
    invalidList: [],
};

export default handleActions(
    {
        // 검색조건 변경
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
        // 스토어 데이터 초기화
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_COLUMNIST]: (state) => {
            return produce(state, (draft) => {
                draft.columnist = initialState.columnist;
            });
        },
        // 스토어 데이터 변경
        [act.CHANGE_INVALID_LINK]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        // 리스트 데이터 조회
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
        // 정보 조회
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
