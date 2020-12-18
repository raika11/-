import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'code/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_SERVICE_LIST = 'code/CLEAR_SERVICE_LIST';
export const CLEAR_SECTION_LIST = 'code/CLEAR_SECTION_LIST';
export const CLEAR_CONTENT_LIST = 'code/CLEAR_CONTENT_LIST';
export const CLEAR_MASTER_CODE_LIST = 'code/CLEAR_MASTER_CODE_LIST';
export const clearServiceList = createAction(CLEAR_SERVICE_LIST);
export const clearSectionList = createAction(CLEAR_SECTION_LIST);
export const clearContentList = createAction(CLEAR_CONTENT_LIST);
export const clearMasterCodeList = createAction(CLEAR_MASTER_CODE_LIST);

/**
 * 서비스코드 전체 리스트 조회
 */
export const [GET_MASTER_CODE_LIST, GET_MASTER_CODE_LIST_SUCCESS, GET_MASTER_CODE_LIST_FAILURE] = createRequestActionTypes('code/GET_MASTER_CODE_LIST');
export const getMasterCodeList = createAction(GET_MASTER_CODE_LIST);

/**
 * 서비스코드(대분류) 리스트 조회
 * 검색조건 없음
 */
export const [GET_CODE_SERVICE_LIST, GET_CODE_SERVICE_LIST_SUCCESS, GET_CODE_SERVICE_LIST_FAILURE] = createRequestActionTypes('code/GET_CODE_SERVICE_LIST');
export const getCodeServiceList = createAction(GET_CODE_SERVICE_LIST);

/**
 * 섹션코드(중분류) 리스트 조회
 */
export const CHANGE_SECTION_SEARCH_OPTION = 'code/CHANGE_SECTION_SEARCH_OPTION';
export const changeSectionSearchOption = createAction(CHANGE_SECTION_SEARCH_OPTION, (search) => search);
export const [GET_CODE_SECTION_LIST, GET_CODE_SECTION_LIST_SUCCESS, GET_CODE_SECTION_LIST_FAILURE] = createRequestActionTypes('code/GET_CODE_SECTION_LIST');
export const getCodeSectionList = createAction(GET_CODE_SECTION_LIST, (...actions) => actions);

/**
 * 컨텐츠코드(소분류) 리스트 조회
 */
export const CHANGE_CONTENT_SEARCH_OPTION = 'code/CHANGE_CONTENT_SEARCH_OPTION';
export const changeContentSearchOption = createAction(CHANGE_CONTENT_SEARCH_OPTION, (search) => search);
export const [GET_CODE_CONTENT_LIST, GET_CODE_CONTENT_LIST_SUCCESS, GET_CODE_CONTENT_LIST_FAILURE] = createRequestActionTypes('code/GET_CODE_CONTENT_LIST');
export const getCodeContentList = createAction(GET_CODE_CONTENT_LIST, (...actions) => actions);

/**
 * korName으로 검색하는 코드 목록
 */
export const CHANGE_KORNAME_SEARCH_OPTION = 'code/CHANGE_KORNAME_SEARCH_OPTION';
export const changeKornameSearchOption = createAction(CHANGE_KORNAME_SEARCH_OPTION, (search) => search);
export const [GET_CODE_KORNAME_LIST, GET_CODE_KORNAME_LIST_SUCCESS, GET_CODE_KORNAME_LIST_FAILURE] = createRequestActionTypes('code/GET_CODE_KORNAME_LIST');
export const getCodeKornameList = createAction(GET_CODE_KORNAME_LIST, (...actions) => actions);
