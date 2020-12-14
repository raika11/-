import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'bright/CLEAR_STORE';
export const CLEAR_OVP = 'bright/CLEAR_OVP';
export const CLEAR_LIVE = 'bright/CLEAR_LIVE';

/**
 * OVP 목록 조회
 */
export const [GET_OVP_LIST, GET_OVP_LIST_SUCCESS, GET_OVP_LIST_FAILURE] = createRequestActionTypes('bright/GET_OVP_LIST');
export const getOvpList = createAction(GET_OVP_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * LIVE 영상 목록 조회
 */
export const [GET_LIVE_LIST, GET_LIVE_LIST_SUCCESS, GET_LIVE_LIST_FAILURE] = createRequestActionTypes('bright/GET_LIVE_LIST');
export const getLiveList = createAction(GET_LIVE_LIST, () => ({}));

/**
 * VOD 옵션 변경
 */
export const CHANGE_VOD_OPTIONS = 'desking/CHANGE_VOD_OPTIONS';
export const changeVodOptions = createAction(CHANGE_VOD_OPTIONS, ({ key, value }) => ({ key, value }));

/**
 * VOD 옵션 초기화
 */
export const CLEAR_VOD_OPTIONS = 'desking/CLEAR_VOD_OPTIONS';
export const clearVodOptions = createAction(CLEAR_VOD_OPTIONS);
