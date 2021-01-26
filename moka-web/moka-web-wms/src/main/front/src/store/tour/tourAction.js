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
/**
 * 데이터 조회
 */
export const [GET_TOUR_GUIDE_LIST, GET_TOUR_GUIDE_LIST_SUCCESS, GET_TOUR_GUIDE_LIST_FAILURE] = createRequestActionTypes('tour/GET_TOUR_GUIDE_LIST');
export const getTourGuideList = createAction(GET_TOUR_GUIDE_LIST, () => ({}));
/**
 * 저장, 수정
 */
export const PUT_TOUR_GUIDE_LIST = 'tour/PUT_TOUR_GUIDE_LIST';
export const putTourGuideList = createAction(PUT_TOUR_GUIDE_LIST, ({ tourGuideList, callback }) => ({ tourGuideList, callback }));
