import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';
import { PAGESIZE_OPTIONS } from '~/constants';

/**
 *  action
 *  */

export const CHANGE_EDIT_ALL = 'reservedStore/CHANGE_EDIT_ALL';
export const CHANGE_EDITS = 'reservedStore/CHANGE_EDITS';

export const CLEAR_RESERVED = 'componentStore/CLEAR_RESERVED';
export const CLEAR_RESERVED_INFO = 'componentStore/CLEAR_RESERVED_INFO';

// 예약어 목록 조회
export const [
    GET_RESERVED_LIST,
    GET_RESERVED_LIST_SUCCESS,
    GET_RESERVED_LIST_FAILURE
] = createRequestActionTypes('reservedStore/GET_RESERVED_LIST');

// 예약어 상세 조회
export const [GET_RESERVED, GET_RESERVED_SUCCESS, GET_RESERVED_FAILURE] = createRequestActionTypes(
    'reservedStore/GET_RESERVED'
);

// 예약어 수정
export const [PUT_RESERVED, PUT_RESERVED_SUCCESS, PUT_RESERVED_FAILURE] = createRequestActionTypes(
    'reservedStore/PUT_RESERVED'
);

// 예약어 삭제
export const [
    DELETE_RESERVED,
    DELETE_RESERVED_SUCCESS,
    DELETE_RESERVED_FAILURE
] = createRequestActionTypes('reservedStore/DELETE_RESERVED');

// action creator

// 예약어 목록 조회
export const getReservedList = createAction(GET_RESERVED_LIST, (search) => search);

// 예약어 상세 조회
export const getReserved = createAction(GET_RESERVED, (codeTypeId) => codeTypeId);

/**
 * action creator
 */
export const changeEditAll = createAction(CHANGE_EDIT_ALL, (payload) => payload);
export const changeEdits = createAction(CHANGE_EDITS, (payload) => payload);

export const clearReserved = createAction(CLEAR_RESERVED, (payload) => payload);

// 예약어 수정
export const putReserved = createAction(PUT_RESERVED, (payload) => payload);

// 예약어 삭제
export const deleteReserved = createAction(DELETE_RESERVED, (reservedSeq) => reservedSeq);

// 초기값
export const defaultReserved = {
    reservedSeq: null,
    reservedId: null,
    reservedValue: null,
    description: null,
    domain: 'null',
    userYn: null
};
export const defaultSearch = {
    domainId: null,
    searchType: 'all',
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    sort: 'reservedId,desc',
    keyword: ''
};

// init
export const initialState = {
    reservedList: [],
    total: 0,
    reservedListError: null,
    reserved: null,
    reservedError: null,
    parent: null,
    search: defaultSearch,
    latestReservedSeq: null,
    page: 0,
    pageError: null
};

// reducer
const reservedStore = handleActions(
    {
        [CHANGE_EDITS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.edit[obj.key] = obj.value;
                }
            });
        },
        [CHANGE_EDIT_ALL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.edit = payload;
            });
        },

        [CLEAR_RESERVED_INFO]: (state) => {
            return {
                ...state,
                reserved: initialState.reserved,
                latestReservedSeq: null,
                datasetError: null
            };
        },

        // 리스트 조회 성공
        [GET_RESERVED_LIST_SUCCESS]: (state, { payload: reservedData }) => {
            return {
                ...state,
                reservedList: reservedData.data.body.list,
                total: reservedData.data.body.totalCnt,
                reservedListError: null,
                parent: null
            };
        },
        // 리스트 조회 실패
        [GET_RESERVED_LIST_FAILURE]: (state, { payload: reservedListError }) => {
            return {
                ...state,
                reservedList: null,
                reservedListError
            };
        },
        // 상세 조회 성공
        [GET_RESERVED_SUCCESS]: (state, { payload: { body } }) => {
            return {
                ...state,
                reserved: {
                    ...body
                },
                latestReservedSeq: body.reservedSeq,
                datasetError: null
            };
        },
        // 상세 조회 실패
        [GET_RESERVED_FAILURE]: (state, { payload: reservedError }) => ({
            ...state,
            reservedError
        }),

        // 예약어 수정 성공
        [PUT_RESERVED_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            reserved: body,
            latestReservedSeq: body.reservedSeq,
            reservedError: null
        }),
        // 예약어 수정 실패
        [PUT_RESERVED_FAILURE]: (state, { payload: reservedError }) => ({
            ...state,
            reservedError
        }),
        // 예약어 삭제 성공
        [DELETE_RESERVED_SUCCESS]: (state) => ({
            ...state,
            reserved: initialState.reserved,
            reservedError: null
        }),
        // 예약어 삭제 실패
        [DELETE_RESERVED_FAILURE]: (state, { payload: reservedError }) => ({
            ...state,
            reservedError
        })
    },
    initialState
);

export default reservedStore;
