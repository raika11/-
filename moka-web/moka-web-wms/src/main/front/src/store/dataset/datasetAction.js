import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'dataset/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'dataset/CLEAR_STORE';
export const CLEAR_DATASET = 'dataset/CLEAR_DATASET';
export const CLEAR_LIST = 'dataset/CLEAR_LIST';
export const CLEAR_SEARCH = 'dataset/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearDataset = createAction(CLEAR_DATASET);
export const clearList = createAction(CLEAR_STORE);
export const clearSearch = createAction(CLEAR_STORE);

/**
 * 데이터 조회
 */
export const [GET_DATASET_LIST, GET_DATASET_LIST_SUCCESS, GET_DATASET_LIST_FAILURE] = createRequestActionTypes('dataset/GET_DATASET_LIST');
export const [GET_DATASET, GET_DATASET_SUCCESS, GET_DATASET_FAILURE] = createRequestActionTypes('dataset/GET_DATASET');
export const getDatasetList = createAction(GET_DATASET_LIST, (...actions) => actions);
export const getDataset = createAction(GET_DATASET, ({ datasetSeq, callback }) => ({ datasetSeq, callback }));

/**
 * 모달 데이터 조회
 */
export const GET_DATASET_LIST_MODAL = 'dataset/GET_DATASET_LIST_MODAL';
export const getDatasetListModal = createAction(GET_DATASET_LIST_MODAL, ({ search, callback, type }) => ({ search, callback, type }));
export const GET_DATASET_API_LIST = 'dataset/GET_DATASET_API_LIST';
export const getDatasetApiList = createAction(GET_DATASET_API_LIST, ({ search, callback, type }) => ({ search, callback, type }));

/**
 * 데이터 변경
 */
export const CHANGE_DATASET = 'dataset/CHANGE_DATASET';
export const changeDataset = createAction(CHANGE_DATASET, (dataset) => dataset);

/**
 * 저장
 */
export const SAVE_DATASET = 'dataset/SAVE_DATASET';
export const saveDataset = createAction(SAVE_DATASET, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 삭제
 */
export const [DELETE_DATASET, DELETE_DATASET_SUCCESS, DELETE_DATASET_FAILURE] = createRequestActionTypes('dataset/DELETE_DATASET');
export const deleteDataset = createAction(DELETE_DATASET, ({ datasetSeq, callback }) => ({ datasetSeq, callback }));

/**
 * 데이터셋 복사
 */
export const COPY_DATASET = 'dataset/COPY_DATASET';
export const copyDataset = createAction(COPY_DATASET, ({ datasetSeq, datasetName, callback }) => ({ datasetSeq, datasetName, callback }));

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'dataset/HAS_RELATION_LIST';
export const hasRelationList = createAction(HAS_RELATION_LIST, ({ datasetSeq, callback }) => ({ datasetSeq, callback }));
