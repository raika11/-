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
export const clearStore = createAction(CLEAR_STORE);

/**
 * 데이터 조회
 */
export const [GET_DATASET_LIST, GET_DATASET_LIST_SUCCESS, GET_DATASET_LIST_FAILURE] = createRequestActionTypes('dataset/GET_DATASET_LIST');
export const getDatasetList = createAction(GET_DATASET_LIST, (...actions) => actions);

/**
 * 데이터 변경
 */
export const CHANGE_DATASET = 'dataset/CHANGE_DATASET';
export const changeDataset = createAction(CHANGE_DATASET, (dataset) => dataset);
