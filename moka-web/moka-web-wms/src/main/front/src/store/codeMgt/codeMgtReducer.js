import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './codeMgtAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
const initialState = {
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
        searchType: 'all',
        keyword: '',
    },
    grpList: [],
    grpTotal: 0,
    grpError: null,
    cdList: [],
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
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_GRP_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.grpSearch[key] = value;
            });
        },
        [act.CHANGE_SEARCH_GRP_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.grpSearch[obj.key] = obj.value;
                }
            });
        },
        [act.CHANGE_SEARCH_CD_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.cdSearch[key] = value;
            });
        },
        [act.CHANGE_SEARCH_CD_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.cdSearch[obj.key] = obj.value;
                }
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_CODE_MGT_LIST_SUCCESS]: (state, { payload: body }) => {
            return produce(state, (draft) => {
                draft.cdList = body.cdList;
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
