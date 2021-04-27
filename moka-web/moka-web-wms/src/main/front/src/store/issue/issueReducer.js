import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/issue/issueAction';
import { PAGESIZE_OPTIONS, S_MODAL_PAGESIZE_OPTIONS, DESK_STATUS_PUBLISH } from '@/constants';

export const CAT_DIV = {
    SEARCH_KEYWORD: 'K',
    REPORTER: 'R',
    SECTION: 'S',
    DIGITAL_SPECIAL: 'D',
    OVP: 'O',
    CATEGORY: 'C',
    PACKAGE: 'P',
};

// 패키지 키워드 기본값
const initialPkgKeyword = {
    andOr: 'A',
    catDiv: '',
    sdate: null,
    edate: null,
    keyword: '',
    kwdCnt: 0,
    kwdOrd: 0,
    ordNo: 0,
    pkgSeq: null,
    repMaster: 0,
    schCondi: { title: false, keyword: false },
    seqNo: null,
};

// 패키지 데스킹 기본값
const initialDesking = {
    seqNo: null,
    pkgSeq: null,
    compNo: null,
    viewYn: 'N',
    status: null, // SAVE(임시) | PUBLISH(전송)
    contentsId: null,
    contentsOrd: 1,
    channelType: null,
    title: '',
    linkUrl: null,
    linkTarget: '_self',
    thumbFileName: null,
    thumbFile: null,
    bgColor: null,
    duration: null,
    bodyHead: null,
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
        category: '', // 카테고리
        div: 'all', // 패키지 유형
        scbYn: 'all', // 구독 여부
        usedYn: null, // 노출 여부
        keyword: '',
        sort: 'pkgSeq,desc',
    },
    contentsSearch: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        pkgSeq: null,
    },
    // 구독 검색조건
    scbYnSearchTypeList: [
        { id: 'all', name: '구독 전체' },
        { id: 'Y', name: '구독' },
        { id: 'N', name: '비구독' },
    ],
    pkg: {
        pkgSeq: null,
        artCnt: 0,
        packageKeywords: {
            search: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.SEARCH_KEYWORD },
            },
            reporter: {
                isUsed: false,
                keyword: {
                    ...initialPkgKeyword,
                    catDiv: CAT_DIV.REPORTER,
                    reporter: [],
                },
            },
            section: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.SECTION },
            },
            digitalSpecial: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.DIGITAL_SPECIAL },
            },
            ovp: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.OVP },
            },
            category: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.CATEGORY },
            },
            pkg: {
                isUsed: false,
                keyword: { ...initialPkgKeyword, catDiv: CAT_DIV.PACKAGE },
            },
        },
        seasonOptions: {},
        reserveDt: null,
        updDt: null,
        usedYn: 'Y',
        seasons: [
            { checked: false, value: '' },
            { checked: false, value: '' },
            { checked: false, value: '' },
        ],
    },
    // 이슈의 데스킹
    desking: [],
    // 이슈의 데스킹 히스토리
    deskingHistory: {
        search: {
            page: 0,
            size: S_MODAL_PAGESIZE_OPTIONS[0],
            searchDt: null, // 검색일자
            pkgSeq: null,
            compNo: null,
            status: DESK_STATUS_PUBLISH, // 상태
        },
        total: 0,
        list: [],
        detail: [],
    },
    invalidList: [],
    initialPkgKeyword,
    initialDesking,
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
        [act.CLEAR_ISSUE_DESKING_HISTORY]: (state) => {
            return produce(state, (draft) => {
                draft.deskingHistory = initialState.deskingHistory;
            });
        },
        /**
         * 검색조건 변경
         */
        [act.CHANGE_ISSUE_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
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
        /**
         * 이슈 데스킹
         */
        [act.GET_ISSUE_DESKING_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.desking = payload.body.list;
            });
        },
        /**
         * 이슈 데스킹 히스토리
         */
        [act.GET_ISSUE_DESKING_HISTORY_LIST_SUCCESS]: (state, { payload: { body, payload } }) => {
            return produce(state, (draft) => {
                draft.deskingHistory.search = payload.search;
                draft.deskingHistory.list = body.list;
                draft.deskingHistory.total = body.total;
            });
        },
        [act.GET_ISSUE_DESKING_HISTORY_LIST_FAILURE]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.deskingHistory.search = payload.search;
            });
        },
        [act.GET_ISSUE_DESKING_HISTORY_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.deskingHistory.detail = body;
            });
        },
        [act.GET_ISSUE_DESKING_HISTORY_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.deskingHistory.detail = initialState.deskingHistory.detail;
            });
        },
    },
    initialState,
);
