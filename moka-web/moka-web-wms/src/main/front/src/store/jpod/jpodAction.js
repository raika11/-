import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'board/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

// 검색 옵션 처리.
export const CHANGE_CHANNEL_SEARCH_OPTION = 'jpod/CHANGE_CHANNEL_SEARCH_OPTION';
export const changeChannelSearchOption = createAction(CHANGE_CHANNEL_SEARCH_OPTION, (actions) => actions);

// 진행자 검색 모달
export const CLEAR_REPORTER = 'jpod/CLEAR_REPORTER';
export const clearReporter = createAction(CLEAR_REPORTER);
export const CHANGE_REPORTER_SEARCH_OPTION = 'jpod/CHANGE_REPORTER_SEARCH_OPTION';
export const changeReporterSearchOption = createAction(CHANGE_REPORTER_SEARCH_OPTION, (actions) => actions);
export const [GET_REPORTER_LIST, GET_REPORTER_LIST_SUCCESS, GET_REPORTER_LIST_FAILURE] = createRequestActionTypes('jpod/GET_REPORTER_LIST');
export const getReporterList = createAction(GET_REPORTER_LIST, (actions) => actions);
export const SELECT_REPORTER = 'jpod/SELECT_REPORTER';
export const selectReporter = createAction(SELECT_REPORTER, (actions) => actions);

// 팟티검색 모달
export const CLEAR_CHANNEL_PODTY = 'jpod/CLEAR_CHANNEL_PODTY';
export const clearChannelPodty = createAction(CLEAR_CHANNEL_PODTY);
export const [GET_CHANNEL_PODTY_LIST, GET_CHANNEL_PODTY_LIST_SUCCESS, GET_CHANNEL_PODTY_LIST_FAILURE] = createRequestActionTypes('jpod/GET_CHANNEL_PODTY_LIST');
export const getChannelPodtyList = createAction(GET_CHANNEL_PODTY_LIST, (actions) => actions);
export const SELECT_CHANNEL_PODTY = 'jpod/SELECT_CHANNEL_PODTY';
export const selectChannelPodty = createAction(SELECT_CHANNEL_PODTY, (actions) => actions);

export const [SAVE_JPOD_CHANNEL, SAVE_JPOD_CHANNEL_SUCCESS, SAVE_JPOD_CHANNEL_FAILURE] = createRequestActionTypes('jpod/SAVE_JPOD_CHANNEL');
export const saveJpodChannel = createAction(SAVE_JPOD_CHANNEL, ({ type, channelinfo, callback }) => ({ type, channelinfo, callback }));
