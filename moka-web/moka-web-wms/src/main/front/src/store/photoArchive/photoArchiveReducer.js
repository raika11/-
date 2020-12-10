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
        imageType: [],
    },
    imageTypeList: [],
    photo: {},
};

export default handleActions(
    {
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 사진 목록 조회
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
         * 사진 유형 목록 조회
         */
        [act.GET_PHOTO_TYPES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.imageTypeList = body.list;
            });
        },
        [act.GET_PHOTO_TYPES_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.imageTypeList = initialState.imageTypeList;
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
        [act.GET_PHOTO_FAILURE]: (state, { payload: { payload } }) => {
            return produce(state, (draft) => {
                draft.photo = initialState.photo;
                draft.error = payload;
            });
        },
    },
    initialState,
);
