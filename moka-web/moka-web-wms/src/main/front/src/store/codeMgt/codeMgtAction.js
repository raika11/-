import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_SEARCH_GRP_OPTION = 'codeMgt/CHANGE_SEARCH_GRP_OPTION';
export const CHANGE_SEARCH_GRP_OPTIONS = 'codeMgt/CHANGE_SEARCH_GRP_OPTIONS';
export const changeSearchGrpOption = createAction(CHANGE_SEARCH_GRP_OPTION, ({ key, value }) => ({ key, value }));
export const changeSearchGrpOptions = createAction(CHANGE_SEARCH_GRP_OPTIONS, (payload) => payload);
export const CHANGE_SEARCH_CD_OPTION = 'codeMgt/CHANGE_SEARCH_CD_OPTION';
export const CHANGE_SEARCH_CD_OPTIONS = 'codeMgt/CHANGE_SEARCH_CD_OPTIONS';
export const changeSearchCdOption = createAction(CHANGE_SEARCH_CD_OPTION, ({ key, value }) => ({ key, value }));
export const changeSearhCdOptions = createAction(CHANGE_SEARCH_CD_OPTIONS, (payload) => payload);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_CODE_MGT = 'codeMgt/CLEAR_CODE_MGT';
export const clearCodeMgt = createAction(CLEAR_CODE_MGT, (payload) => payload);

/**
 * 데이터 조회 액션
 */
export const [GET_CODE_MGT_GRP_LIST, GET_CODE_MGT_GRP_LIST_SUCCESS, GET_CODE_MGT_GRP_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT_GRP_LIST');
export const [GET_CODE_MGT_LIST, GET_CODE_MGT_LIST_SUCCESS, GET_CODE_MGT_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT_LIST');
export const getCodeMgtGrpList = createAction(GET_CODE_MGT_GRP_LIST, (payload) => payload);
export const getCodeMgtList = createAction(GET_CODE_MGT_LIST, (payload) => payload);

/**
 * 조회용 데이터 액션
 */
export const READ_ONLY_SUCCESS = 'codeMgt/READ_ONLY_SUCCESS';
export const READ_ONLY_FAILURE = 'codeMgt/READ_ONLY_FAILURE';
export const GET_TP_SIZE = 'codeMgt/GET_TPSIZE';
export const GET_TP_ZONE = 'codeMgt/GET_TPZONE';
export const GET_LANG = 'codeMgt/GET_LANG';
export const GET_SERVICE_TYPE = 'codeMgt/GET_SERVICE_TYPE';
export const GET_PAGE_TYPE = 'codeMgt/GET_PAGE_TYPE';
export const GET_API = 'codeMgt/GET_API';
export const getTPSize = createAction(GET_TP_SIZE);
export const getTPZone = createAction(GET_TP_ZONE);
export const getLang = createAction(GET_LANG);
export const getServiceType = createAction(GET_SERVICE_TYPE);
export const getPageType = createAction(GET_PAGE_TYPE);
export const getApi = createAction(GET_API);
