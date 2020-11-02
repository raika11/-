import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './codeMgtAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    // 코드 그룹 검색 조건
    grpSearch: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: undefined,
    },
    // 코드 그룹의 리스트 검색 조건
    cdSearch: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: undefined,
        grpCd: null,
        searchType: 'dtlCd',
        keyword: '',
    },
    grpList: [],
    grp: {},
    grpTotal: 0,
    grpError: null,
    cdList: [],
    cd: {},
    cdTotal: 0,
    cdError: null,
    // 조회용 데이터
    tpSizeRows: [],
    tpZoneRows: [],
    langRows: [],
    serviceTypeRows: [],
    pageTypeRows: [],
    apiRows: [],
};

export default handleActions(
    {
        /**
         * 스토어 클리어
         */
        [act.CLEAR_CODE_MGT]: () => initialState,
        [act.CLEAR_GRP]: (state) => {
            return produce(state, (draft) => {
                draft.grp = initialState.grp;
                draft.grpError = initialState.grpError;
                draft.grpTotal = initialState.grpTotal;
                draft.grpSearch = initialState.grpSearch;
            });
        },
        [act.CLEAR_CD_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.cdTotal = initialState.cdTotal;
                draft.cdSearch = initialState.cdSearch;
                draft.cdList = initialState.cdList;
            });
        },
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grpSearch = payload;
                draft.cdSearch = payload;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_GRP]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grp = payload;
            });
        },
        [act.CHANGE_CD]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.cd = payload;
            });
        },
        /**
         * 목록 조회
         */
        [act.GET_CODE_MGT_GRP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.grpList = body.list;
                draft.grpTotal = body.totalCnt;
                draft.grpError = initialState.grpError;
            });
        },
        [act.GET_CODE_MGT_GRP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grpList = initialState.grpList;
                draft.grpTotal = initialState.grpTotal;
                draft.grpError = payload;
            });
        },
        [act.GET_CODE_MGT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.cdList = body.list;
                draft.cdTotal = body.totalCnt;
                draft.cdError = initialState.cdError;
            });
        },
        [act.GET_CODE_MGT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.cdList = initialState.cdList;
                draft.cdTotal = initialState.cdTotal;
                draft.cdError = payload;
            });
        },
        /**
         * 상세 조회, 등록, 수정
         */
        [act.GET_CODE_MGT_GRP_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.grp = body;
                draft.grpError = initialState.grpError;
            });
        },
        [act.GET_CODE_MGT_GRP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grp = initialState.grp;
                draft.grpError = payload;
            });
        },
        [act.GET_CODE_MGT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.cd = body;
                draft.cdError = initialState.cdError;
            });
        },
        [act.GET_CODE_MGT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.cd = initialState.cd;
                draft.cdError = payload;
            });
        },
        /**
         * 데이터 삭제
         */
        [act.DELETE_CODE_MGT_GRP_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.grp = initialState.grp;
                draft.grpError = initialState.grpError;
            });
        },
        [act.DELETE_CODE_MGT_GRP_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.grpError = payload;
            });
        },
        [act.DELETE_CODE_MGT_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.cd = initialState.cd;
                draft.cdError = initialState.cdError;
            });
        },
        [act.DELETE_CODE_MGT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.cdError = payload;
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
                draft[rowName] = initialState[rowName];
            });
        },
    },
    initialState,
);
