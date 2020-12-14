import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_GRP_SEARCH_OPTION = 'codeMgt/CHANGE_SEARCH_GRP_OPTION';
export const CHANGE_CD_SEARCH_OPTION = 'codeMgt/CHANGE_CD_SEARCH_OPTION';
export const changeGrpSearchOption = createAction(CHANGE_GRP_SEARCH_OPTION, (search) => search);
export const changeCdSearchOption = createAction(CHANGE_CD_SEARCH_OPTION, (search) => search);

/**
 * 유효성 검사
 */
export const CHANGE_INVALID_LIST = 'codeMgt/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_STORE = 'codeMgt/CLEAR_STORE';
export const CLEAR_GRP = 'codeMgt/CLEAR_GRP';
export const CLEAR_CD = 'codeMgt/CLEAR_CD';
export const CLEAR_GRP_LIST = 'codeMgt/CLEAR_GRP_LIST';
export const CLEAR_CD_LIST = 'codeMgt/CLEAR_CD_LIST';
export const clearStore = createAction(CLEAR_STORE, (payload) => payload);
export const clearGrp = createAction(CLEAR_GRP, (payload) => payload);
export const clearCd = createAction(CLEAR_CD, (payload) => payload);
export const clearGrpList = createAction(CLEAR_GRP_LIST, (payload) => payload);
export const clearCdList = createAction(CLEAR_CD_LIST, (payload) => payload);

/**
 * 데이터 조회 액션
 */
export const [GET_CODE_MGT_GRP_LIST, GET_CODE_MGT_GRP_LIST_SUCCESS, GET_CODE_MGT_GRP_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT_GRP_LIST');
export const [GET_CODE_MGT_LIST, GET_CODE_MGT_LIST_SUCCESS, GET_CODE_MGT_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT_LIST');
export const [GET_CODE_MGT_GRP, GET_CODE_MGT_GRP_SUCCESS, GET_CODE_MGT_GRP_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT_GRP');
export const [GET_CODE_MGT, GET_CODE_MGT_SUCCESS, GET_CODE_MGT_FAILURE] = createRequestActionTypes('codeMgt/GET_CODE_MGT');
export const getCodeMgtGrpList = createAction(GET_CODE_MGT_GRP_LIST, (...actions) => actions);
export const getCodeMgtList = createAction(GET_CODE_MGT_LIST, (...actions) => actions);
export const getCodeMgtGrp = createAction(GET_CODE_MGT_GRP, (grpCd) => grpCd);
export const getCodeMgt = createAction(GET_CODE_MGT, (cdSeq) => cdSeq);

/**
 * 데이터 저장 액션
 */
export const SAVE_CODE_MGT_GRP = 'codeMgt/SAVE_CODE_MGT_GRP';
export const SAVE_CODE_MGT = 'codeMgt/SAVE_CODE_MGT';
export const saveCodeMgtGrp = createAction(SAVE_CODE_MGT_GRP, ({ type, actions, callback }) => ({ type, actions, callback }));
export const saveCodeMgt = createAction(SAVE_CODE_MGT, ({ type, actions, callback }) => ({ type, actions, callback }));

/**
 * 데이터 변경 액션
 */
export const CHANGE_GRP = 'codeMgt/CHANGE_GRP';
export const CHANGE_CD = 'codeMgt/CHANGE_CD';
export const changeGrp = createAction(CHANGE_GRP, (grp) => grp);
export const changeCd = createAction(CHANGE_CD, (cd) => cd);

/**
 * 데이터 삭제 액션
 */
export const [DELETE_CODE_MGT_GRP, DELETE_CODE_MGT_GRP_SUCCESS, DELETE_CODE_MGT_GRP_FAILURE] = createRequestActionTypes('codeMgt/DELETE_CODE_MGT_GRP');
export const [DELETE_CODE_MGT, DELETE_CODE_MGT_SUCCESS, DELETE_CODE_MGT_FAILURE] = createRequestActionTypes('codeMgt/DELETE_CODE_MGT');
export const deleteCodeMgtGrp = createAction(DELETE_CODE_MGT_GRP, ({ grpSeq, callback }) => ({ grpSeq, callback }));
export const deleteCodeMgt = createAction(DELETE_CODE_MGT, (cdSeq) => cdSeq);

/**
 * 중복 검사
 */
export const GET_CODE_MGT_GRP_DUPLICATE_CHECK = 'codeMgt/GET_CODE_MGT_GRP_DUPLICATE_CHECK';
export const GET_CODE_MGT_DUPLICATE_CHECK = 'codeMgt/GET_CODE_MGT_DUPLICATE_CHECK';
export const getCodeMgtGrpDuplicateCheck = createAction(GET_CODE_MGT_GRP_DUPLICATE_CHECK, ({ grpCd, callback }) => ({ grpCd, callback }));
export const getCodeMgtDuplicateCheck = createAction(GET_CODE_MGT_DUPLICATE_CHECK, ({ grpCd, dtlCd, callback }) => ({ grpCd, dtlCd, callback }));

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
export const GET_ART_GROUP = 'codeMgt/GET_ART_GROUP';
export const GET_BULK_CHAR = 'codeMgt/GET_BULK_CHAR';
export const GET_DS_FONT_IMGD = 'codeMgt/GET_DS_FONT_IMGD';
export const GET_DS_FONT_IMGW = 'codeMgt/GET_DS_FONT_IMGW';
export const GET_DS_FONT_VODD = 'codeMgt/GET_DS_FONT_VODD';
export const GET_DS_TITLE_LOC = 'codeMgt/GET_DS_TITLE_LOC';
export const GET_DS_PRE = 'codeMgt/GET_DS_PRE';
export const GET_DS_PRE_LOC = 'codeMgt/GET_DS_PRE_LOC';
export const GET_DS_ICON = 'codeMgt/GET_DS_ICON';
export const GET_ARTICLE_TYPE = 'codeMgt/GET_ARTICLE_TYPE';
export const getTpSize = createAction(GET_TP_SIZE);
export const getTpZone = createAction(GET_TP_ZONE);
export const getLang = createAction(GET_LANG);
export const getServiceType = createAction(GET_SERVICE_TYPE);
export const getPageType = createAction(GET_PAGE_TYPE);
export const getApi = createAction(GET_API);
export const getArtGroup = createAction(GET_ART_GROUP);
export const getBulkChar = createAction(GET_BULK_CHAR);
export const getArticleType = createAction(GET_ARTICLE_TYPE);
export const getDsFontImgD = createAction(GET_DS_FONT_IMGD);
export const getDsFontImgW = createAction(GET_DS_FONT_IMGW);
export const getDsFontVodD = createAction(GET_DS_FONT_VODD);
export const getDsTitleLoc = createAction(GET_DS_TITLE_LOC);
export const getDsPre = createAction(GET_DS_PRE);
export const getDsPreLoc = createAction(GET_DS_PRE_LOC);
export const getDsIcon = createAction(GET_DS_ICON);

export const [GET_SPECIAL_CHAR_CODE, GET_SPECIAL_CHAR_CODE_SUCCESS, GET_SPECIAL_CHAR_CODE_FAILURE] = createRequestActionTypes('codeMgt/GET_SPECIAL_CHAR_CODE');
export const getSpecialCharCode = createAction(GET_SPECIAL_CHAR_CODE);

export const SAVE_SPECIAL_CHAR_CODE = 'codeMgt/SAVE_SPECIAL_CHAR_CODE';
export const saveSpecialCharCode = createAction(SAVE_SPECIAL_CHAR_CODE);
