import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_GRP_SEARCH_OPTION = 'codeMgt/CHANGE_SEARCH_GRP_OPTION';
export const CHANGE_DTL_SEARCH_OPTION = 'codeMgt/CHANGE_DTL_SEARCH_OPTION';
export const changeGrpSearchOption = createAction(CHANGE_GRP_SEARCH_OPTION, (search) => search);
export const changeDtlSearchOption = createAction(CHANGE_DTL_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_STORE = 'codeMgt/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE, (payload) => payload);
export const CLEAR_GRP_LIST = 'codeMgt/CLEAR_GRP_LIST';
export const clearGrpList = createAction(CLEAR_GRP_LIST, (payload) => payload);
export const CLEAR_DTL_LIST = 'codeMgt/CLEAR_DTL_LIST';
export const clearDtlList = createAction(CLEAR_DTL_LIST, (payload) => payload);

/**
 * 데이터 조회 액션
 */
export const [GET_GRP_LIST, GET_GRP_LIST_SUCCESS, GET_GRP_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_GRP_LIST');
export const getGrpList = createAction(GET_GRP_LIST, ({ search, callback }) => ({ search, callback }));
export const [GET_DTL_LIST, GET_DTL_LIST_SUCCESS, GET_DTL_LIST_FAILURE] = createRequestActionTypes('codeMgt/GET_DTL_LIST');
export const getDtlList = createAction(GET_DTL_LIST, ({ search, callback }) => ({ search, callback }));
export const [GET_GRP, GET_GRP_SUCCESS] = createRequestActionTypes('codeMgt/GET_GRP'); // 사용하는지 체크해야함
export const getGrp = createAction(GET_GRP, ({ grpCd, callback }) => ({ grpCd, callback }));
export const GET_GRP_MODAL = 'codeMgt/GET_GRP_MODAL';
export const getGrpModal = createAction(GET_GRP_MODAL, ({ grpCd, callback }) => ({ grpCd, callback }));
export const GET_DTL_MODAL = 'codeMgt/GET_DTL_MODAL';
export const getDtlModal = createAction(GET_DTL_MODAL, ({ seqNo, callback }) => ({ seqNo, callback }));

/**
 * 데이터 저장 액션
 */
export const SAVE_GRP = 'codeMgt/saveGrp';
export const saveGrp = createAction(SAVE_GRP, ({ grp, callback }) => ({ grp, callback }));
export const SAVE_DTL = 'codeMgt/SAVE_DTL';
export const saveDtl = createAction(SAVE_DTL, ({ dtl, callback }) => ({ dtl, callback }));

/**
 * 데이터 삭제 액션
 */
export const DELETE_GRP = 'codeMgt/DELETE_GRP';
export const deleteGrp = createAction(DELETE_GRP, ({ seqNo, callback }) => ({ seqNo, callback }));
export const DELETE_DTL = 'codeMgt/DELETE_DTL';
export const deleteDtl = createAction(DELETE_DTL, ({ seqNo, callback }) => ({ seqNo, callback }));

/**
 * 중복 검사
 */
export const EXISTS_GRP = 'codeMgt/EXISTS_GRP';
export const EXISTS_DTL = 'codeMgt/EXISTS_DTL';
export const existsGrp = createAction(EXISTS_GRP, ({ grpCd, callback }) => ({ grpCd, callback }));
export const existsDtl = createAction(EXISTS_DTL, ({ grpCd, dtlCd, callback }) => ({ grpCd, dtlCd, callback }));

/**
 * 조회용 데이터 액션
 * 리턴 결과 : { ...코드데이터, id: 코드키, name: 코드라벨 }
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
export const GET_PT = 'codeMgt/GET_PT';
export const GET_CHANNEL_TP = 'codeMgt/GET_CHANNEL_TP';
export const GET_PRESS_CATE1 = 'codeMgt/GET_PRESS_CATE1';
export const GET_PRESS_CATE61 = 'codeMgt/GET_PRESS_CATE61';
export const GET_HTTP_METHOD = 'codeMgt/GET_HTTP_METHOD';
export const GET_API_TYPE = 'codeMgt/GET_API_TYPE';
export const GET_TOUR_AGE = 'codeMgt/GET_TOUR_AGE';
export const GET_BULK_SITE = 'codeMgt/GET_BULK_SITE';
export const GET_PRESS_CATE_JA = 'codeMgt/GET_PRESS_CATE_JA';
export const GET_PRESS_CATE_SUNDAY = 'codeMgt/GET_PRESS_CATE_SUNDAY';
export const GET_GEN_CATE = 'codeMgt/GET_GEN_CATE';
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
export const getPt = createAction(GET_PT);
export const getChannelTp = createAction(GET_CHANNEL_TP);
export const getPressCate1 = createAction(GET_PRESS_CATE1);
export const getPressCate61 = createAction(GET_PRESS_CATE61);
export const getHttpMethod = createAction(GET_HTTP_METHOD);
export const getApiType = createAction(GET_API_TYPE);
export const getTourAge = createAction(GET_TOUR_AGE);
export const getBulkSite = createAction(GET_BULK_SITE);
export const getGenCate = createAction(GET_GEN_CATE);

export const [GET_SPECIAL_CHAR_CODE, GET_SPECIAL_CHAR_CODE_SUCCESS, GET_SPECIAL_CHAR_CODE_FAILURE] = createRequestActionTypes('codeMgt/GET_SPECIAL_CHAR_CODE');
export const getSpecialCharCode = createAction(GET_SPECIAL_CHAR_CODE);

export const SAVE_SPECIAL_CHAR_CODE = 'codeMgt/SAVE_SPECIAL_CHAR_CODE';
export const saveSpecialCharCode = createAction(SAVE_SPECIAL_CHAR_CODE);

export const CHANGE_SPECIAL_CHAR_CODE = 'codeMgt/CHANGE_SPECIAL_CHAR_CODE';
export const changeSpecialCharCode = createAction(CHANGE_SPECIAL_CHAR_CODE);

export const CLEAR_SPECIAL_CHAR_CODE = 'codeMgt/CLEAR_SPECIAL_CHAR_CODE';
export const clearSpecialCharCode = createAction(CLEAR_SPECIAL_CHAR_CODE);
