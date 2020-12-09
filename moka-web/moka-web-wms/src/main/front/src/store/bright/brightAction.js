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
export const getLiveList = createAction(GET_LIVE_LIST);
