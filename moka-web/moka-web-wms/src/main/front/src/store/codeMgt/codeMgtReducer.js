import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './codeMgtAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    // 그룹코드
    grp: {
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            secretYn: 'N',
            searchType: 'grp',
            keyword: '',
        },
        total: 0,
        list: [],
        error: null,
        grp: {},
    },
    searchTypeList: [
        { name: '그룹명', id: 'grpCdNm' },
        { name: '그룹코드', id: 'grpCd' },
        { name: '그룹 전체', id: 'grp' },
        { name: '상세코드명', id: 'dtlCdNm' },
        { name: '상세코드', id: 'dtlCd' },
        { name: '상세코드 전체', id: 'dtl' },
    ],
    // 상세코드
    dtl: {
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            grpCd: null,
            searchType: 'dtlCd',
            keyword: '',
        },
        total: 0,
        list: [],
        error: null,
        dtl: {
            usedYn: 'N',
            cdOrd: 1,
        },
    },
    specialCharCode: {
        cdNm: '',
        dtlCd: '',
        grpCd: '',
        seqNo: null,
    },
};

export default handleActions(
    {
        /**
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_GRP_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.grp.list = initialState.grp.list;
            });
        },
        [act.CLEAR_DTL_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.dtl.list = initialState.dtl.list;
            });
        },
        /**
         * 검색조건 변경
         */
        [act.CHANGE_GRP_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grp.search = payload;
            });
        },
        [act.CHANGE_DTL_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.dtl.search = payload;
            });
        },
        /**
         * 목록 조회
         */
        [act.GET_GRP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.grp.list = body.list;
                draft.grp.total = body.totalCnt;
                draft.grp.error = initialState.grp.error;
            });
        },
        [act.GET_GRP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grp.list = initialState.grp.list;
                draft.grp.total = initialState.grp.total;
                draft.grp.error = payload;
            });
        },
        [act.GET_DTL_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.dtl.list = body.list;
                draft.dtl.total = body.totalCnt;
                draft.dtl.error = initialState.dtl.error;
            });
        },
        [act.GET_DTL_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.dtl.list = initialState.dtl.list;
                draft.dtl.total = initialState.dtl.totalCnt;
                draft.dtl.error = payload;
            });
        },
        /**
         * 조회용 데이터 => Rows 변환
         */
        [act.READ_ONLY_SUCCESS]: (state, { payload: { rowName, body } }) => {
            return produce(state, (draft) => {
                const rows = body.list.map((cd) => {
                    return {
                        ...cd,
                        id: cd.dtlCd,
                        name: cd.cdNm,
                    };
                });
                draft[rowName] = rows;
            });
        },
        [act.READ_ONLY_FAILURE]: (state, { payload: { rowName } }) => {
            return produce(state, (draft) => {
                draft[rowName] = [];
            });
        },
        /**
         * specialCharCode
         */
        [act.GET_SPECIAL_CHAR_CODE_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.specialCharCode = { ...draft.specialCharCode, ...payload };
            });
        },
        [act.CLEAR_SPECIAL_CHAR_CODE]: (state) => {
            return produce(state, (draft) => {
                draft.specialCharCode = initialState.specialCharCode;
            });
        },
        [act.CHANGE_SPECIAL_CHAR_CODE]: (state, { payload: cdNm }) => {
            return produce(state, (draft) => {
                draft.specialCharCode.cdNm = cdNm;
            });
        },
    },
    initialState,
);
