import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './articleAction';
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
        searchType: 'all',
        keyword: '',
        pressPan: null, // 판
        pressMyun: null, // 면
        contentType: null, // 분류..?
        // 매체 조건 추가해야함
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'artTitlce', name: '제목' },
    ],
    inputTag: '',
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
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
    },
    initialState,
);
