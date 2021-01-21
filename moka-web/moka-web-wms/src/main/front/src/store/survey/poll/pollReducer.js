import { handleActions } from 'redux-actions';
import * as action from '@store/survey/poll/pollAction';
import produce from 'immer';

export const initialState = {
    poll: {
        pollSeq: null,
        pollGroup: '',
        pollCategory: '0100',
        pollDiv: 'W',
        pollType: 'M',
        startDt: null,
        endDt: null,
        status: 'T',
        loginYn: 'Y',
        repetitionYn: 'Y',
        mainYn: 'N',
        bbsYn: 'Y',
        bbsUrl: '',
        replyYn: 'Y',
        itemCnt: 2,
        allowAnswCnt: 1,
        pollItems: [],
    },
    codes: {
        pollCategory: [],
        pollGroup: [],
        status: [
            { key: 'S', value: '서비스 중' },
            { key: 'T', value: '일시 중지' },
        ],
        pollDiv: [
            { key: 'W', value: '일반형' },
            { key: 'V', value: '비교형' },
        ],
    },
    search: {
        page: 0,
        size: 20,
        searchType: 'title',
        keyword: '',
        pollGroup: 'A',
        pollCategory: '',
        startDt: '',
        endDt: '',
        status: '',
    },
    total: 0,
    list: [],
};

export default handleActions(
    {
        [action.CLEAR_POLL]: (state) => {
            return produce(state, (draft) => {
                draft.poll = initialState.poll;
            });
        },
        [action.CHANGE_POLL_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [action.GET_POLL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = payload.data.body.totalCnt;
                draft.list = payload.data.body.list;
            });
        },
        [action.GET_POLL_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.poll = payload;
            });
        },
        [action.GET_POLL_CATEGORY_CODES_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.codes.pollCategory = payload;
            });
        },
        [action.GET_POLL_GROUP_CODES_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.codes.pollGroup = payload;
            });
        },
    },
    initialState,
);
