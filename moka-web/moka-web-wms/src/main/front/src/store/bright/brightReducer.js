import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './brightAction';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    invalidList: [],
    ovp: {
        list: [],
        error: null,
        search: {
            page: 0,
            size: MODAL_PAGESIZE_OPTIONS[0],
            searchType: 'name',
            keyword: '',
        },
    },
    live: {
        list: [],
        error: null,
    },
    vodOptions: {},
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_OVP]: (state) => {
            return produce(state, (draft) => {
                draft.ovp = initialState.ovp;
            });
        },
        [act.CLEAR_LIVE]: (state) => {
            return produce(state, (draft) => {
                draft.live = initialState.live;
            });
        },
        [act.CLEAR_VOD_OPTIONS]: (state) => {
            return produce(state, (draft) => {
                draft.vodOptions = initialState.vodOptions;
            });
        },
        /**
         * VOD 옵션 변경
         */
        [act.CHANGE_VOD_OPTIONS]: (state, { payload }) => {
            const { key, value } = payload;

            return produce(state, (draft) => {
                draft.vodOptions[key] = value;
            });
        },
        /**
         * 리스트 조회
         */
        [act.GET_OVP_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                const { body, payload: actionPayload } = payload;
                const { search } = actionPayload;

                if (search.page === 0) {
                    // search.page === 0이면 리스트 다시 조회
                    draft.ovp.list = body.list;
                } else {
                    // search.page > 0 이면 더보기형식이므로 concat으로 합침
                    draft.ovp.list = Array.prototype.concat(draft.ovp.list, body.list);
                }
                draft.ovp.error = initialState.ovp.error;
            });
        },
        [act.GET_OVP_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.ovp.list = initialState.ovp.list;
                draft.ovp.error = payload;
            });
        },
        [act.GET_LIVE_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.live.list = payload.body.list;
                draft.live.error = initialState.live.error;
            });
        },
        [act.GET_LIVE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.live.list = initialState.live.list;
                draft.live.error = payload;
            });
        },
    },
    initialState,
);
