import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';

import { CLEAR_STORE, GET_QUIZZES_LIST_SUCCESS, CHANGE_SEARCH_OPTION, CLEAR_QUIZINFO, GET_QUIZZES_SUCCESS, QUIZ_QUESTION_ITEM } from './quizAction';

/**
 * initialState
 */
export const initialState = {
    common: {},
    quizzes: {
        total: 0,
        list: [],
        error: null,
        search: {
            // sort: 'quizSeq,asc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            quizSts: '',
            quizType: '',
            loginYn: '',
            replyYn: '',
            delYn: '',
            title: '',
            quizDesc: '',
        },
    },
    quizInfo: {
        delYn: 'N',
        imgUrl: null,
        loginYn: 'Y',
        questions: [],
        quizDesc: '',
        quizRels: [],
        quizSeq: 0,
        quizSts: 'Y',
        quizType: 'AA',
        quizUrl: null,
        regDt: '',
        regMember: { memberId: '', memberNm: '' },
        replyYn: 'Y',
        title: '',
        voteCnt: 0,
        imgFile: null,
    },
    quizQuestions: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 스토어 초기화.
         */
        [CLEAR_STORE]: () => initialState,
        // 리스트 조회 성공.
        [GET_QUIZZES_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.quizzes.list = body.list;
                draft.quizzes.total = body.totalCnt;
            });
        },
        // 검색 옵션 처리.
        [CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.quizzes.search = payload;
            });
        },
        // 퀴즈 등록 정보 초기화.
        [CLEAR_QUIZINFO]: (state) => {
            return produce(state, (draft) => {
                draft.quizInfo = initialState.quizInfo;
            });
        },
        // 목록에서 퀴즈 선택했을때 취즈 정보 업데이트
        [GET_QUIZZES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.quizInfo = body;
            });
        },
        // 목록에서 퀴즈 선택했을때 취즈 정보 업데이트
        [QUIZ_QUESTION_ITEM]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.quizQuestions = payload;
            });
        },
    },
    initialState,
);
