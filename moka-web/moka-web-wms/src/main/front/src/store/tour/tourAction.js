import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'tour/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * Invalid check
 */
export const CHANGE_INVALID_LIST = 'tour/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'tour/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_SEARCH = 'tour/CLEAR_SEARCH';
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_TOUR_GUIDE_LIST, GET_TOUR_GUIDE_LIST_SUCCESS, GET_TOUR_GUIDE_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_GUIDE_LIST');
export const getTourGuideList = createAction(GET_TOUR_GUIDE_LIST, () => ({}));
export const [GET_TOUR_DENY_LIST, GET_TOUR_DENY_LIST_SUCCESS, GET_TOUR_DENY_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_DENY_LIST');
export const getTourDenyList = createAction(GET_TOUR_DENY_LIST, () => ({}));
export const [GET_TOUR_SETUP, GET_TOUR_SETUP_SUCCESS, GET_TOUR_SETUP_FAILURE] = createRequestActionTypes('tour/GET_TOUR_SETUP');
export const getTourSetup = createAction(GET_TOUR_SETUP, () => ({}));
export const [GET_TOUR_APPLY_LIST, GET_TOUR_APPLY_LIST_SUCCESS, GET_TOUR_APPLY_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_APPLY_LIST');
export const getTourApplyList = createAction(GET_TOUR_APPLY_LIST, (...actions) => actions);
export const [GET_TOUR_APPLY, GET_TOUR_APPLY_SUCCESS] = createRequestActionTypes('special/GET_TOUR_APPLY');
export const getTourApply = createAction(GET_TOUR_APPLY, ({ tourSeq, callback }) => ({ tourSeq, callback }));
export const [GET_TOUR_DENY_POSSIBLE_LIST, GET_TOUR_DENY_POSSIBLE_LIST_SUCCESS] = createRequestActionTypes('tour/GET_TOUR_DENY_POSSIBLE_LIST');
export const getTourDenyPossibleList = createAction(GET_TOUR_DENY_POSSIBLE_LIST, () => ({}));
export const [GET_TOUR_DENY_MONTH_LIST, GET_TOUR_DENY_MONTH_LIST_SUCCESS, GET_TOUR_DENY_MONTH_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_DENY_MONTH_LIST');
export const getTourDenyMonthList = createAction(GET_TOUR_DENY_MONTH_LIST, ({ year, month, callback }) => ({ year, month, callback }));
export const [GET_TOUR_APPLY_MONTH_LIST, GET_TOUR_APPLY_MONTH_LIST_SUCCESS, GET_TOUR_APPLY_MONTH_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_APPLY_MONTH_LIST');
export const getTourApplyMonthList = createAction(GET_TOUR_APPLY_MONTH_LIST, ({ year, month, callback }) => ({ year, month, callback }));

/**
 * 저장, 수정
 */
export const PUT_TOUR_GUIDE_LIST = 'tour/PUT_TOUR_GUIDE_LIST';
export const putTourGuideList = createAction(PUT_TOUR_GUIDE_LIST, ({ tourGuideList, callback }) => ({ tourGuideList, callback }));
export const SAVE_TOUR_DENY = 'tour/SAVE_TOUR_DENY';
export const saveTourDeny = createAction(SAVE_TOUR_DENY, ({ tourDeny, search, callback }) => ({ tourDeny, search, callback }));
export const PUT_TOUR_SETUP = 'tour/PUT_TOUR_SETUP';
export const putTourSetup = createAction(PUT_TOUR_SETUP, ({ tourSetup, callback }) => ({ tourSetup, callback }));
export const PUT_TOUR_APPLY = 'tour/PUT_TOUR_APPLY';
export const putTourApply = createAction(PUT_TOUR_APPLY, ({ tourApply, callback }) => ({ tourApply, callback }));

/**
 * 삭제
 */
export const DELETE_TOUR_DENY = 'tour/DELETE_TOUR_DENY';
export const deleteTourDeny = createAction(DELETE_TOUR_DENY, ({ denySeq, search, callback }) => ({ denySeq, search, callback }));
export const DELETE_TOUR_APPLY = 'tour/DELETE_TOUR_APPLY';
export const deleteTourApply = createAction(DELETE_TOUR_APPLY, ({ tourSeq, callback }) => ({ tourSeq, callback }));

/**
 * 비밀번호 초기화
 */
export const POST_RESET_PWD = 'tour/POST_RESET_PWD';
export const postResetPwd = createAction(POST_RESET_PWD, ({ phone, callback }) => ({ phone, callback }));
