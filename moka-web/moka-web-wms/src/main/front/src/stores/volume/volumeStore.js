import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { PAGESIZE_OPTIONS } from '~/constants';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'volumeStore/CHANGE_SEARCH_OPTION';
export const CLEAR_SEARCH_OPTION = 'volumeStore/CLEAR_SEARCH_OPTION';
export const CLEAR_VOLUME = 'volumeStore/CLEAR_VOLUME';
export const CLEAR_VOLUME_LIST = 'volumeStore/CLEAR_VOLUME_LIST';
export const CLEAR_VOLUME_DETAIL = 'volumeStore/CLEAR_VOLUME_DETAIL';
export const [GET_VOLUMES, GET_VOLUMES_SUCCESS, GET_VOLUMES_FAILURE] = createRequestActionTypes(
    'volumeStore/GET_VOLUMES'
);
export const [GET_VOLUME, GET_VOLUME_SUCCESS, GET_VOLUME_FAILURE] = createRequestActionTypes(
    'volumeStore/GET_VOLUME'
);
export const SAVE_VOLUME = 'volumeStore/SAVE_VOLUME';
export const [
    DELETE_VOLUME,
    DELETE_VOLUME_SUCCESS,
    DELETE_VOLUME_FAILURE
] = createRequestActionTypes('volumeStore/DELETE_VOLUME');
export const HAS_RELATIONS = 'volumeStore/HAS_RELATIONS';

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const clearVolume = createAction(CLEAR_VOLUME, (payload) => payload);
export const clearVolumeList = createAction(CLEAR_VOLUME_LIST);
export const clearVolumeDetail = createAction(CLEAR_VOLUME_DETAIL);
export const getVolumes = createAction(GET_VOLUMES, (...actions) => actions);
export const getVolume = createAction(GET_VOLUME, (payload) => payload);
export const saveVolume = createAction(SAVE_VOLUME, (payload) => payload);
export const deleteVolume = createAction(DELETE_VOLUME, (payload) => payload);
export const hasRelations = createAction(HAS_RELATIONS, (payload) => payload);

/**
 * initial State
 */
const initialState = {
    total: 0,
    list: [],
    error: undefined,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0]
    },
    detail: {},
    detailError: {}
};

/**
 * reducer
 */
const volumeStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        [CLEAR_VOLUME_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        },
        [CLEAR_VOLUME_DETAIL]: (state) => {
            return produce(state, (draft) => {
                draft.detail = initialState.detail;
                draft.detailError = initialState.detailError;
            });
        },
        [CLEAR_VOLUME]: (state) => {
            return produce(state, (draft) => {
                draft.detail = initialState.detail;
                draft.detailError = initialState.detailError;
            });
        },
        /**
         * 목록
         */
        [GET_VOLUMES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_VOLUMES_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [GET_VOLUME_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = body;
            });
        },
        [GET_VOLUME_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
                draft.detail = initialState.detail;
            });
        },
        /**
         * 삭제
         */
        [DELETE_VOLUME_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = initialState.detailError;
                draft.detail = initialState.detail;
            });
        },
        [DELETE_VOLUME_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
            });
        }
    },
    initialState
);

export default volumeStore;
