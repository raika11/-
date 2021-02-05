import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색 조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'mic/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const CHANGE_FEED_SEARCH_OPTION = 'mic/CHANGE_FEED_SEARCH_OPTION';
export const changeFeedSearchOption = createAction(CHANGE_FEED_SEARCH_OPTION, (search) => search);

export const CHANGE_INVALID_LIST = 'mic/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'mic/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_MIC_AGENDA = 'mic/CLEAR_MIC_AGENDA';
export const clearMicAgenda = createAction(CLEAR_MIC_AGENDA);
export const CLEAR_MIC_FEED = 'mic/CLEAR_MIC_FEED';
export const clearMicFeed = createAction(CLEAR_MIC_FEED);

/**
 * 아젠다 목록 조회
 */
export const [GET_MIC_AGENDA_LIST, GET_MIC_AGENDA_LIST_SUCCESS, GET_MIC_AGENDA_LIST_FAILURE] = createRequestActionTypes('mic/GET_MIC_AGENDA_LIST');
export const getMicAgendaList = createAction(GET_MIC_AGENDA_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 아젠다 목록 조회 (모달)
 */
export const GET_MIC_AGENDA_LIST_MODAL = 'mic/GET_MIC_AGENDA_LIST_MODAL';
export const getMicAgendaListModal = createAction(GET_MIC_AGENDA_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 아젠다 저장
 */
export const SAVE_MIC_AGENDA = 'mic/SAVE_MIC_AGENDA';
export const saveMicAgenda = createAction(SAVE_MIC_AGENDA, ({ agenda, callback }) => ({ agenda, callback }));

/**
 * 아젠다 상세 조회
 */
export const [GET_MIC_AGENDA, GET_MIC_AGENDA_SUCCESS, GET_MIC_AGENDA_FAILURE] = createRequestActionTypes('mic/GET_MIC_AGENDA');
export const getMicAgenda = createAction(GET_MIC_AGENDA, ({ agndSeq, callback }) => ({ agndSeq, callback }));

/**
 * 아젠다 카테고리 목록 조회
 */
export const [GET_MIC_CATEGORY_LIST, GET_MIC_CATEGORY_LIST_SUCCESS, GET_MIC_CATEGORY_LIST_FAILURE] = createRequestActionTypes('mic/GET_MIC_CATEGORY_LIST');
export const getMicCategoryList = createAction(GET_MIC_CATEGORY_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 아젠다 카테고리 수정
 */
export const SAVE_MIC_CATEGORY = 'mic/SAVE_MIC_CATEGORY';
export const saveMicCategory = createAction(SAVE_MIC_CATEGORY, ({ category, categoryList, callback }) => ({ category, categoryList, callback }));

/**
 * 아젠다 순서 변경
 */
export const PUT_MIC_AGENDA_SORT = 'mic/PUT_MIC_AGENDA_SORT';
export const putMicAgendaSort = createAction(PUT_MIC_AGENDA_SORT, ({ sortedList, callback }) => ({ sortedList, callback }));

/**
 * 아젠다, 전체 포스트 수 조회
 */
export const [GET_MIC_REPORT, GET_MIC_REPORT_SUCCESS] = createRequestActionTypes('mic/GET_MIC_REPORT');
export const getMicReport = createAction(GET_MIC_REPORT);

/**
 * 배너 목록 조회(모달)
 */
export const GET_MIC_BANNER_LIST_MODAL = 'mic/GET_MIC_BANNER_LIST_MODAL';
export const getMicBannerListModal = createAction(GET_MIC_BANNER_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 배너 저장
 */
export const SAVE_MIC_BANNER = 'mic/SAVE_MIC_BANNER';
export const saveMicBanner = createAction(SAVE_MIC_BANNER, ({ banner, callback }) => ({ banner, callback }));

/**
 * 배너 사용여부 변경
 */
export const PUT_MIC_BANNER_TOGGLE = 'mic/PUT_MIC_BANNER_TOGGLE';
export const putMicBannerToggle = createAction(PUT_MIC_BANNER_TOGGLE, ({ bnnrSeq, callback }) => ({ bnnrSeq, callback }));

/**
 * 피드 목록 조회
 */
export const [GET_MIC_FEED_LIST, GET_MIC_FEED_LIST_SUCCESS, GET_MIC_FEED_LIST_FAILURE] = createRequestActionTypes('mic/GET_MIC_FEED_LIST');
export const getMicFeedList = createAction(GET_MIC_FEED_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 피드 상세 조회
 */
export const [GET_MIC_FEED, GET_MIC_FEED_SUCCESS, GET_MIC_FEED_FAILURE] = createRequestActionTypes('mic/GET_MIC_FEED');
export const getMicFeed = createAction(GET_MIC_FEED, ({ answSeq, callback }) => ({ answSeq, callback }));

/**
 * 피드 저장
 */
export const SAVE_MIC_FEED = 'mic/SAVE_MIC_FEED';
export const saveMicFeed = createAction(SAVE_MIC_FEED, ({ feed, callback }) => ({ feed, callback }));

/**
 * 답변 최상위 수정
 */
export const PUT_MIC_ANSWER_TOP = 'mic/PUT_MIC_ANSWER_TOP';
export const putMicAnswerTop = createAction(PUT_MIC_ANSWER_TOP, ({ answSeq, answTop, callback }) => ({ answSeq, answTop, callback }));

/**
 * 답변 사용여부 수정
 */
export const PUT_MIC_ANSWER_USED = 'mic/PUT_MIC_ANSWER_USED';
export const putMicAnswerUsed = createAction(PUT_MIC_ANSWER_USED, ({ answSeq, usedYn, callback }) => ({ answSeq, usedYn, callback }));
