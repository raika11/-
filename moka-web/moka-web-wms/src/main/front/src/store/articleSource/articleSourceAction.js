import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 데스킹 매체 조회
export const [GET_DESKING_SOURCE_LIST, GET_DESKING_SOURCE_LIST_SUCCESS, GET_DESKING_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_DESKING_SOURCE_LIST');
export const getDeskingSourceList = createAction(GET_DESKING_SOURCE_LIST, () => ({}));

// 타입별(JOONGANG/CONSALES/JSTORE/SOCIAL/BULK/RCV) 매체 목록 조회
export const [GET_TYPE_SOURCE_LIST, GET_TYPE_SOURCE_LIST_SUCCESS, GET_TYPE_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_TYPE_SOURCE_LIST');
export const getTypeSourceList = createAction(GET_TYPE_SOURCE_LIST, ({ type, callback }) => ({ type, callback }));

// clear
export const CLEAR_STORE = 'articleSource/CLEAR_STORE';
export const CLEAR_ARTICLE_SOURCE = 'articleSource/CLEAR_ARTICLE_SOURCE';
export const CLEAR_LIST = 'articleSource/CLEAR_LIST';
export const CLEAR_SEARCH = 'articleSource/CLEAR_SEARCH';
export const CLEAR_MAPPING_CODE = 'articleSource/CLEAR_MAPPING_CODE';
export const CLEAR_MAPPING_LIST = 'articleSource/CLEAR_MAPPING_LIST';
export const CLEAR_MAPPING_SEARCH = 'articleSource/CLEAR_MAPPING_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearArticleSource = createAction(CLEAR_ARTICLE_SOURCE);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearMappingCode = createAction(CLEAR_MAPPING_CODE);
export const clearMappingList = createAction(CLEAR_MAPPING_LIST);
export const clearMappingSearch = createAction(CLEAR_MAPPING_SEARCH);

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'articleSource/CHANGE_SEARCH_OPTION';
export const CHANGE_MODAL_SEARCH_OPTION = 'articleSource/CHANGE_MODAL_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeModalSearchOption = createAction(CHANGE_MODAL_SEARCH_OPTION, (mappingSearch) => mappingSearch);

// invalid
export const CHANGE_INVALID_LIST = 'articleSource/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

// 매체 목록조회
export const [GET_SOURCE_LIST, GET_SOURCE_LIST_SUCCESS, GET_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_SOURCE_LIST');
export const getSourceList = createAction(GET_SOURCE_LIST, (...actions) => actions);

// 매체 중복 체크
export const GET_SOURCE_DUPLICATE_CHECK = 'articleSource/GET_SOURCE_DUPLICATE_CHECK';
export const getSourceDuplicateCheck = createAction(GET_SOURCE_DUPLICATE_CHECK, ({ sourceCode, callback }) => ({ sourceCode, callback }));

// 매체 상세조회
export const [GET_ARTICLE_SOURCE, GET_ARTICLE_SOURCE_SUCCESS, GET_ARTICLE_SOURCE_FAILURE] = createRequestActionTypes('articleSource/GET_ARTICLE_SOURCE');
export const getArticleSource = createAction(GET_ARTICLE_SOURCE, ({ sourceCode }) => ({ sourceCode }));

// 매체 등록, 수정
export const SAVE_ARTICLE_SOURCE = 'articleSource/SAVE_ARTICLE_SOURCE';
export const saveArticleSource = createAction(SAVE_ARTICLE_SOURCE, ({ source, callback }) => ({ source, callback }));

// 매핑 목록조회
export const [GET_MAPPING_CODE_LIST, GET_MAPPING_CODE_LIST_SUCCESS, GET_MAPPING_CODE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_MAPPING_CODE_LIST');
export const getMappingCodeList = createAction(GET_MAPPING_CODE_LIST, (...actions) => actions);

// 매핑코드 중복 체크
export const GET_MAPPING_CODE_DUPLICATE_CHECK = 'articleSource/GET_MAPPING_CODE_DUPLICATE_CHECK';
export const getMappingCodeDuplicateCheck = createAction(GET_MAPPING_CODE_DUPLICATE_CHECK, ({ sourceCode, frCode, callback }) => ({ sourceCode, frCode, callback }));

// 매핑코드 상세조회
export const [GET_MAPPING_CODE, GET_MAPPING_CODE_SUCCESS, GET_MAPPING_CODE_FAILURE] = createRequestActionTypes('articleSource/GET_MAPPING_CODE');
export const getMappingCode = createAction(GET_MAPPING_CODE, ({ sourceCode, seqNo }) => ({ sourceCode, seqNo }));

// 매핑 코드 등록, 수정
export const SAVE_MAPPING_CODE = 'articleSource/SAVE_MAPPING_CODE';
export const saveMappingCode = createAction(SAVE_MAPPING_CODE, ({ mappingCode, callback }) => ({ mappingCode, callback }));

// 매핑코드 삭제
export const [DELETE_MAPPING_CODE, DELETE_MAPPING_CODE_SUCCESS, DELETE_MAPPING_CODE_FAILURE] = createRequestActionTypes('articleSource/DELETE_MAPPING_CODE');
export const deleteMappingCode = createAction(DELETE_MAPPING_CODE, ({ sourceCode, seqNo, callback }) => ({ sourceCode, seqNo, callback }));
