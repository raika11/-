import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'template/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'dataset/CLEAR_STORE';
export const CLEAR_DATASET = 'dataset/CLEAR_TEMPLATE';
export const CLEAR_LIST = 'dataset/CLEAR_LIST';
export const CLEAR_SEARCH = 'dataset/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'dataset/CLEAR_RELATION_LIST';
export const clearStore = createAction(CLEAR_STORE);
export const clearDataset = createAction(CLEAR_DATASET);
export const clearList = createAction(CLEAR_STORE);
export const clearSearch = createAction(CLEAR_STORE);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);

/**
 * 데이터 조회
 */
export const [GET_DATASET_LIST, GET_DATASET_LIST_SUCCESS, GET_DATASET_LIST_FAILURE] = createRequestActionTypes('dataset/GET_DATASET_LIST');
export const [GET_DATASET, GET_DATASET_SUCCESS, GET_DATASET_FAILURE] = createRequestActionTypes('dataset/GET_DATASET');
export const getDatasetList = createAction(GET_DATASET_LIST, (...actions) => actions);
export const getDataset = createAction(GET_DATASET, (domainSeq) => domainSeq);

/**
 * 데이터 변경
 */
export const CHANGE_DATASET = 'dataset/CHANGE_DATASET';
export const changeDataset = createAction(CHANGE_DATASET, (dataset) => dataset);

/**
 * 관련아이템 검색조건 변경
 */
export const CHANGE_SEARCH_PG_OPTION = 'dataset/CHANGE_SEARCH_PG_OPTION';
export const CHANGE_SEARCH_SK_OPTION = 'dataset/CHANGE_SEARCH_SK_OPTION';
export const CHANGE_SEARCH_CT_OPTION = 'dataset/CHANGE_SEARCH_CT_OPTION';
export const CHANGE_SEARCH_CP_OPTION = 'dataset/CHANGE_SEARCH_CP_OPTION';
export const changeSearchPGOption = createAction(CHANGE_SEARCH_PG_OPTION, (search) => search);
export const changeSearchSKOption = createAction(CHANGE_SEARCH_SK_OPTION, (search) => search);
export const changeSearchCTOption = createAction(CHANGE_SEARCH_CT_OPTION, (search) => search);
export const changeSearchCPOption = createAction(CHANGE_SEARCH_CP_OPTION, (search) => search);

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'dataset/HAS_RELATION_LIST';
export const [GET_RELATION_LIST, GET_RELATION_LIST_SUCCESS, GET_RELATION_LIST_FAILURE] = createRequestActionTypes('dataset/GET_RELATION_LIST');
export const hasRelationList = createAction(HAS_RELATION_LIST, (payload) => payload);
export const getRelationPGList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'PG',
}));
export const getRelationSKList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'SK',
}));
export const getRelationCTList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CT',
}));
export const getRelationCPList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CP',
}));
