import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'etccodeTypeStore/CHANGE_SEARCH_OPTION';
export const CHANGE_EDIT_ALL = 'etccodeTypeStore/CHANGE_EDIT_ALL';
export const CHANGE_EDITS = 'etccodeTypeStore/CHANGE_EDITS';

// CODETYPE LIST 호출
export const [
    GET_ETCCODETYPE,
    GET_ETCCODETYPE_SUCCESS,
    GET_ETCCODETYPE_FAILURE
] = createRequestActionTypes('etccodeTypeStore/GET_ETCCODETYPE');

// CODETYPE 수정
export const [
    PUT_ETCCODETYPE,
    PUT_ETCCODETYPE_SUCCESS,
    PUT_ETCCODETYPE_FAILURE
] = createRequestActionTypes('etccodeTypeStore/PUT_ETCCODETYPE');

// CODETYPE 삭제
export const [
    DELETE_ETCCODETYPE,
    DELETE_ETCCODETYPE_SUCCESS,
    DELETE_ETCCODETYPE_FAILURE
] = createRequestActionTypes('etccodeTypeStore/DELETE_ETCCODETYPE');

// 조회용 데이터
export const READ_ONLY_SUCCESS = 'etccodeTypeStore/READ_ONLY_SUCCESS';
export const READ_ONLY_FAILURE = 'etccodeTypeStore/READ_ONLY_FAILURE';
export const GET_TP_SIZE = 'etccodeTypeStore/GET_TPSIZE';
export const GET_TP_ZONE = 'etccodeTypeStore/GET_TPZONE';
export const GET_LANG = 'etccodeTypeStore/GET_LANG';
export const GET_SERVICE_TYPE = 'etccodeTypeStore/GET_SERVICE_TYPE';
export const GET_PAGE_TYPE = 'etccodeTypeStore/GET_PAGE_TYPE';
export const GET_API = 'etccodeTypeStore/GET_API';

/**
 * action creator
 */
export const changeEditAll = createAction(CHANGE_EDIT_ALL, (payload) => payload);
export const changeEdits = createAction(CHANGE_EDITS, (payload) => payload);
export const getEtccodeType = createAction(GET_ETCCODETYPE);
export const deleteEtccodeType = createAction(DELETE_ETCCODETYPE, (payload) => payload);
export const putEtccodeType = createAction(PUT_ETCCODETYPE, (payload) => payload);
export const getTPSize = createAction(GET_TP_SIZE);
export const getTPZone = createAction(GET_TP_ZONE);
export const getLang = createAction(GET_LANG);
export const getServiceType = createAction(GET_SERVICE_TYPE);
export const getPageType = createAction(GET_PAGE_TYPE);
export const getApi = createAction(GET_API);

/**
 * initialState
 */
const initialState = {
    total: 0,
    error: undefined,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0]
        // sort: 'codeOrder,asc'
    },
    edit: {
        inputTag: ''
    },
    /**
     * only 조회용 데이터
     */
    tpSizeRows: [],
    tpZoneRows: [],
    langRows: [],
    serviceTypeRows: [],
    pageTypeRows: [],
    apiRows: []
};

/**
 * reducer
 */
const etccodeTypeStore = handleActions(
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
        /**
         * 코드타입 리스트
         */
        [GET_ETCCODETYPE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_ETCCODETYPE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 코드타입 수정
         */
        [PUT_ETCCODETYPE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [PUT_ETCCODETYPE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 코드타입 삭제
         */
        [DELETE_ETCCODETYPE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.detailError = undefined;
                draft.detail = initialState.detail;
            });
        },
        [DELETE_ETCCODETYPE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
            });
        },
        /**
         * 조회용 데이터 => Rows 변환
         */
        [READ_ONLY_SUCCESS]: (state, { payload: { rowName, body } }) => {
            return produce(state, (draft) => {
                const rows = body.list.map((code) => {
                    return {
                        ...code,
                        id: code.codeId,
                        name: code.codeName
                    };
                });
                draft[rowName] = rows;
            });
        },
        [READ_ONLY_FAILURE]: (state, { payload: { rowName } }) => {
            return produce(state, (draft) => {
                draft[rowName] = initialState[rowName];
            });
        }
    },
    initialState
);

export default etccodeTypeStore;
