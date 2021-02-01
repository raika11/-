import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './micAction';
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
        keyword: '',
        agndTop: 'Y',
    },
    agndTopList: [
        { id: 'Y', name: '전체 메뉴' },
        { id: 'N', name: '최상단' },
    ],
    invalidList: [],
    answTotal: 0,
    agndTotal: 0,
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
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 데이터 조회
         */
        [act.GET_MIC_AGENDA_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        /**
         * 아젠다, 전체 포스트 수
         */
        [act.GET_MIC_REPORT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.answTotal = body.answTotal;
                draft.agndTotal = body.agndTotal;
            });
        },
    },
    initialState,
);
