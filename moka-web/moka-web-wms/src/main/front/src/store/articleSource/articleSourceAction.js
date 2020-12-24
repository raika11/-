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
export const clearStore = createAction(CLEAR_STORE);
export const clearArticleSource = createAction(CLEAR_ARTICLE_SOURCE);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'articleSource/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

// invalid
export const CHANGE_INVALID_LIST = 'articleSource/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

// 매체 목록조회
export const [GET_SOURCE_LIST, GET_SOURCE_LIST_SUCCESS, GET_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_SOURCE_LIST');
export const getSourceList = createAction(GET_SOURCE_LIST, (...actions) => actions);

// // 매체 등록
// export const POST_SOURCE = 'articleSource/POST_SOURCE';
// export const postSource = createAction(POST_SOURCE, () => ({}));

// 벌크전송 매체 목록 조회(네이버채널용)
export const [GET_BLUK_SOURCE_LIST, GET_BLUK_SOURCE_LIST_SUCCESS, GET_BLUK_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_BLUK_SOURCE_LIST');
export const getBulkSourceList = createAction(GET_BLUK_SOURCE_LIST, () => ({}));

// // 서비스 기사검색 매체 목록조회
// export const [GET_DESKING_SOURCE_LIST, GET_DESKING_SOURCE_LIST_SUCCESS, GET_DESKING_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_BLUK_SOURCE_LIST');
// export const getDekingSourceList = createAction(GET_DESKING_SOURCE_LIST, () => ({}));

// 매체 상세조회
export const [GET_ARTICLE_SOURCE, GET_ARTICLE_SOURCE_SUCCESS, GET_ARTICLE_SOURCE_FAILURE] = createRequestActionTypes('articleSource/GET_ARTICLE_SOURCE');
export const getArticleSource = createAction(GET_ARTICLE_SOURCE, ({ sourceCode }) => ({ sourceCode }));

// 매체 등록, 수정
export const SAVE_ARTICLE_SOURCE = 'articleSource/SAVE_ARTICLE_SOURCE';
export const saveArticleSource = createAction(SAVE_ARTICLE_SOURCE, ({ sourceCode, callback }) => ({ sourceCode, callback }));

// // 매핑 목록조회
// export const [GET_MAPPING_SOURCE_LIST, GET_MAPPING_SOURCE_LIST_SUCCESS, GET_MAPPING_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_MAPPING_SOURCE');
// export const putMappingSourceList = createAction(GET_MAPPING_SOURCE_LIST, () => ({}));

// // 매체코드 중복 체크
// export const CODE_DUPLICATE_CHECK = 'articleSource/CODE_DUPLICATE_CHECK';
// export const codeDuplicateCheck = createAction(CODE_DUPLICATE_CHECK, () => ({}));

// // 매핑 등록
// export const POST_MAPPING_SOURCE = 'articleSource/POST_MAPPING_SOURCE';
// export const postMappingSourceList = createAction(POST_MAPPING_SOURCE, () => ({}));

// // 매핑코드 중복 체크
// export const MAPPING_DUPLICATE_CHECK = 'articleSource/MAPPING_DUPLICATE_CHECK';
// export const mappingDuplicateCheck = createAction(MAPPING_DUPLICATE_CHECK, () => ({}));

// // 매핑코드 삭제
// export const DELETE_MAPPING_SOURCE = 'articleSource/DELETE_MAPPING_SOURCE';
// export const deleteMappingSource = createAction(DELETE_MAPPING_SOURCE, () => ({}));

// // 매핑코드 상세조회
// export const GET_MAPPING_SOURCE = 'articleSource/GET_MAPPING_SOURCE';
// export const getMappingSource = createAction(GET_MAPPING_SOURCE, () => ({}));

// // 매핑 수정
// export const PUT_MAPPING_SOURCE = 'articleSource/PUT_MAPPING_SOURCE';
// export const putMappingSource = createAction(PUT_MAPPING_SOURCE, () => ({}));
