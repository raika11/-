import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 미리 보기 모달 컨트롤
export const TRY_PREVIEW_MODAL = 'bulks/TRY_PREVIEW_MODAL';
export const SHOW_PREVIEW_MODAL = 'bulks/SHOW_PREVIEW_MODAL';
export const HIDE_PREVIEW_MODAL = 'bulks/HIDE_PREVIEW_MODAL';
export const showPreviewModal = createAction(TRY_PREVIEW_MODAL);
export const hidePreviewModal = createAction(HIDE_PREVIEW_MODAL);

// 최초에 구분 및 출처 처리.
export const INITIALIZE_PARAMS = 'bulks/INITIALIZE_PARAMS';
export const INITIALIZED_PARAMS = 'bulks/INITIALIZED_PARAMS';
export const initializeParams = createAction(INITIALIZE_PARAMS);

export const CLEAR_STORE = 'bulks/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_BULKS_LIST = 'bulks/CLEAR_BULKS_LIST';
export const clearBulksList = createAction(CLEAR_BULKS_LIST);

// 벌크 리스트 조회.
export const [GET_BULK_LIST, GET_BULK_LIST_SUCCESS, GET_BULK_LIST_FAILURE] = createRequestActionTypes('bulks/GET_BULK_LIST');
export const getBulkList = createAction(GET_BULK_LIST, (...actions) => actions);

// 벌크 상세 조회.
export const [GET_BULK_ARTICLE, GET_BULK_ARTICLE_SUCCESS, GET_BULK_ARTICLE_FAILURE] = createRequestActionTypes('bulks/GET_BULK_ARTICLE');
export const getBulkArticle = createAction(GET_BULK_ARTICLE, ({ bulkartSeq, callback }) => ({ bulkartSeq, callback }));

// 벌크 데이터 저장.
export const [SAVE_BULK_ARTICLE, SAVE_BULK_ARTICLE_SUCCESS, SAVE_BULK_ARTICLE_FAILURE] = createRequestActionTypes('bulks/SAVE_BULK_ARTICLE');
export const saveBulkArticle = createAction(SAVE_BULK_ARTICLE, ({ type, bulkArticle, callback }) => ({ type, bulkArticle, callback }));

// 스토어 bulkArticle 정보 변경.
export const CHANGE_BULKARTICLE = 'bulks/CHANGE_BULKARTICLE';
export const changeBulkarticle = createAction(CHANGE_BULKARTICLE);

// 벨리데이션.
export const CHANGE_INVALID_LINK = 'bulks/CHANGE_INVALID_LINK';
export const changeInvalidList = createAction(CHANGE_INVALID_LINK, (invalidList) => invalidList);

// 약물 가지고 오기.
export const [GET_SPECIALCHAR, GET_SPECIALCHAR_SUCCESS, GET_SPECIALCHAR_FAILURE] = createRequestActionTypes('bulks/GET_SPECIALCHAR');
export const getSpecialchar = createAction(GET_SPECIALCHAR, (actions) => actions);

export const [GET_COPYRIGHT, GET_COPYRIGHT_SUCCESS, GET_COPYRIGHT_FAILURE] = createRequestActionTypes('bulks/GET_COPYRIGHT');
export const getCopyright = createAction(GET_COPYRIGHT, (actions) => actions);

// 약물 저장.
export const [SAVE_SPECIALCHAR, SAVE_SPECIALCHAR_SUCCESS, SAVE_SPECIALCHAR_FAILURE] = createRequestActionTypes('bulks/SAVE_SPECIALCHAR');
export const saveSpecialchar = createAction(SAVE_SPECIALCHAR, ({ specialchar, callback }) => ({ specialchar, callback }));

//벌크 상태가 값 변경.
export const [CHANGE_BULKUSED, CHANGE_BULKUSED_SUCCESS, CHANGE_BULKUSED_FAILURE] = createRequestActionTypes('bulks/CHANGE_BULKUSED');
export const changeBulkused = createAction(CHANGE_BULKUSED, ({ bulkartSeq, callback }) => ({ bulkartSeq, callback }));

// 검색 옵션 변경.
export const CHANGE_SEARCH_OPTION = 'bulks/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (actions) => actions);
