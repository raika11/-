import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './photoArchiveAction';
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
        pageCount: PAGESIZE_OPTIONS[0],
        startdate: null,
        finishdate: null,
        searchKey: '',
        searchValue: '',
        imageType: '',
    },
    photo: {},
};

export default handleActions(
    {
        /**
         * 목록 조회
         */
        [act.GET_PHOTO_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = body.error;
            });
        },
        [act.GET_PHOTO_LIST_FAILURE]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.totalCnt;
                draft.error = payload;
            });
        },
        /**
         * 사진 정보 조회
         */
        [act.GET_PHOTO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.photo = body;
                draft.error = body.error;
            });
        },
        [act.GET_PHOTO_SUCCESS]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.photo = initialState.photo;
                draft.error = payload;
            });
        },
    },
    initialState,
);
