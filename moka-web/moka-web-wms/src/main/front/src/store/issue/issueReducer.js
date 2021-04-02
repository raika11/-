import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/issue/issueAction';
import { PAGESIZE_OPTIONS } from '@/constants';

// 패키지 키워드 기본값
const initialPkgKeyword = {
    andOr: '',
    catDiv: '',
    sdate: null,
    edate: null,
    keyword: '',
    kwdCnt: 0,
    kwdOrd: 0,
    ordno: 0,
    pkgSeq: null,
    repMaster: 0,
    schCondi: null,
    seqNo: null,
};

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
        startDt: null, // 시작일시
        endDt: null, // 종료일시
        category: null, // 카테고리
        div: 'all', // 패키지 유형
        scbYn: 'all', // 구독 여부
        usedYn: null, // 노출 여부
        keyword: '',
    },
    // 구독 검색조건
    scbYnSearchTypeList: [
        { id: '', name: '구독 전체 ' },
        { id: 'Y', name: '구독' },
        { id: 'N', name: '비구독' },
    ],
    pkg: {
        pkgSeq: null,
        artCnt: 0,
        packageKeywords: [],
        reserveDt: null,
        updDt: null,
        usedYn: 'Y',
    },
    invalidList: [],
    initialPkgKeyword,
};

export default handleActions(
    {
        /**
         * 스토어 데이터 변경
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_ISSUE]: (state) => {
            return produce(state, (draft) => {
                draft.pkg = initialState.pkg;
            });
        },
        /**
         * 목록 조회
         */
        [act.GET_ISSUE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_ISSUE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.totalCnt;
                draft.error = payload;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_ISSUE_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.pkg = payload;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_ISSUE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.pkg = initialState.pkg;
            });
        },
    },
    initialState,
);
