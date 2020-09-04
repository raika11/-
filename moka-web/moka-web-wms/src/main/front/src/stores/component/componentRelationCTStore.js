import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'componentRelationCTStore/CHANGE_SEARCH_OPTION';
export const CLEAR_RELATIONS = 'componentRelationCTStore/CLEAR_RELATIONS';
export const [
    GET_RELATIONS,
    GET_RELATIONS_SUCCESS,
    GET_RELATIONS_FAILURE
] = createRequestActionTypes('componentRelationCTStore/GET_RELATIONS');

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const clearRelations = createAction(CLEAR_RELATIONS);
export const getRelations = createAction(GET_RELATIONS, (payload) => ({
    relType: 'CT',
    actions: payload
}));

/**
 * initial state
 */
const initialState = {
    total: 0,
    error: undefined,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'containerSeq,desc',
        domainId: undefined,
        componentSeq: undefined,
        relType: 'CT',
        relSeqType: 'CP',
        searchType: 'all',
        keyword: ''
    },
    list: []
};

/**
 * reducer
 */
const componentRelationCTStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CLEAR_RELATIONS]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        },
        /**
         *  컴포넌트 -> 관련 컨테이너 조회
         */
        [GET_RELATIONS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_RELATIONS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        }
    },
    initialState
);

export default componentRelationCTStore;
