import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'board/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

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

// 채널
export const CLEAR_CHANNELS = 'jpod/CLEAR_CHANNELS';
export const clearChannels = createAction(CLEAR_CHANNELS);

// 검색 옵션 처리.
export const CHANGE_JPOD_SEARCH_OPTION = 'jpod/CHANGE_JPOD_SEARCH_OPTION';
export const changeJpodSearchOption = createAction(CHANGE_JPOD_SEARCH_OPTION, (actions) => actions);

export const [GET_CHANNELS, GET_CHANNELS_SUCCESS, GET_CHANNELS_FAILURE] = createRequestActionTypes('jpod/GET_CHANNELS');
export const getChannels = createAction(GET_CHANNELS, (actions) => actions);

export const CLEAR_CHANNEL_INFO = 'jpod/CLEAR_CHANNEL_INFO';
export const clearChannelInfo = createAction(CLEAR_CHANNEL_INFO);

// 채널 정보 가지고 오기.
export const [GET_CHANNEL_INFO, GET_CHANNEL_INFO_SUCCESS, GET_CHANNEL_INFO_FAILURE] = createRequestActionTypes('jpod/GET_CHANNEL_INFO');
export const getChannelInfo = createAction(GET_CHANNEL_INFO, ({ chnlSeq }) => ({ chnlSeq }));

// 채널 저장 처리.
export const [SAVE_JPOD_CHANNEL, SAVE_JPOD_CHANNEL_SUCCESS, SAVE_JPOD_CHANNEL_FAILURE] = createRequestActionTypes('jpod/SAVE_JPOD_CHANNEL');
export const saveJpodChannel = createAction(SAVE_JPOD_CHANNEL, ({ chnlSeq, channelinfo, callback }) => ({ chnlSeq, channelinfo, callback }));
