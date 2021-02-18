import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'jpod/CLEAR_STORE';
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

// 팟티 에피소드 모달
export const CLEAR_PODTY_EPISODE = 'jpod/CLEAR_PODTY_EPISODE';
export const clearPodtyEpisode = createAction(CLEAR_PODTY_EPISODE);
export const CHANGE_PODTY_EPISODE_CASTSRL = 'jpod/CHANGE_PODTY_EPISODE_CASTSRL';
export const changePodtyEpisodeCastsrl = createAction(CHANGE_PODTY_EPISODE_CASTSRL, (actions) => actions);
export const [GET_PODTY_EPISODE_LIST, GET_PODTY_EPISODE_LIST_SUCCESS, GET_PODTY_EPISODE_LIST_FAILURE] = createRequestActionTypes('jpod/GET_PODTY_EPISODE_LIST');
export const getPodtyEpisodeList = createAction(GET_PODTY_EPISODE_LIST, (actions) => actions);
export const SELECT_PODTY_EPISODE = 'jpod/SELECT_PODTY_EPISODE';
export const selectPodtyEpisode = createAction(SELECT_PODTY_EPISODE, (actions) => actions);

// 팟캐스트 모달.
// 에브라이트 코브 목록 초기화.
export const CLEAR_BRIGHT_OVP = 'jpod/CLEAR_BRIGHT_OVP';
export const clearBrightOvp = createAction(CLEAR_BRIGHT_OVP);
// 브라이트 코브 목록 조회.
export const [GET_BRIGHT_OVP, GET_BRIGHT_OVP_SUCCESS, GET_BRIGHT_OVP_FAILURE] = createRequestActionTypes('jpod/GET_BRIGHT_OVP');
export const getBrightOvp = createAction(GET_BRIGHT_OVP, (actions) => actions);
export const SELECT_BRIGHTOVP = 'jpod/SELECT_BRIGHTOVP';
export const selectBrightovp = createAction(SELECT_BRIGHTOVP, (actions) => actions);
export const [SAVE_BRIGHTOVP, SAVE_BRIGHTOVP_SUCCESS, SAVE_BRIGHTOVP_FAILURE] = createRequestActionTypes('jpod/SAVE_BRIGHTOVP');
export const saveBrightovp = createAction(SAVE_BRIGHTOVP, ({ ovpdata, callback }) => ({ ovpdata, callback }));
export const CHANGE_BRIGHTOVP_SEARCH_OPTION = 'jpod/CHANGE_BRIGHTOVP_SEARCH_OPTION';
export const changeBrightovpSearchOption = createAction(CHANGE_BRIGHTOVP_SEARCH_OPTION, (actions) => actions);

/* 채널 */
// 채널 리셋.
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

// 채널 삭제.
export const [DELETE_JPOD_CHANNEL] = createRequestActionTypes('jpod/DELETE_JPOD_CHANNEL');
export const deleteJpodChannel = createAction(DELETE_JPOD_CHANNEL, ({ chnlSeq, callback }) => ({ chnlSeq, callback }));

/* 에피소드 */
export const CLEAR_EPISODE = 'jpod/CLEAR_EPISODE';
export const clearEpisode = createAction(CLEAR_EPISODE);

// 검색 옵션 처리.
export const CHANGE_EPISODES_SEARCH_OPTION = 'jpod/CHANGE_EPISODES_SEARCH_OPTION';
export const changeEpisodesSearchOption = createAction(CHANGE_EPISODES_SEARCH_OPTION, (actions) => actions);

// 채널 리스트 가지고 오기. ( 등록, 수정, 검색등에 사용.)
export const [GET_EPISODE_GUBUN_CHANNELS, GET_EPISODE_GUBUN_CHANNELS_SUCCESS, GET_EPISODE_GUBUN_CHANNELS_FAILURE] = createRequestActionTypes('jpod/GET_EPISODE_GUBUN_CHANNELS');
export const getEpisodeGubunChannels = createAction(GET_EPISODE_GUBUN_CHANNELS, (actions) => actions);

// 에피소드 목록 가지고 오기. ( 에피소드 관리 목록 )
export const [GET_EPISODES, GET_EPISODES_SUCCESS, GET_EPISODES_FAILURE] = createRequestActionTypes('jpod/GET_EPISODES');
export const getEpisodes = createAction(GET_EPISODES, (actions) => actions);

// 에피소드 정보 초기화.
export const CLEAR_EPISODE_INFO = 'jpod/CLEAR_EPISODE_INFO';
export const clearEpisodeInfo = createAction(CLEAR_EPISODE_INFO);

// 에피소드 정보 가지고 오기.
export const [GET_EPISODES_INFO, GET_EPISODES_INFO_SUCCESS, GET_EPISODES_INFO_FAILURE] = createRequestActionTypes('jpod/GET_EPISODES_INFO');
export const getEpisodesInfo = createAction(GET_EPISODES_INFO, ({ chnlSeq, epsdSeq }) => ({ chnlSeq, epsdSeq }));

// 에피소드 목록 가지고 오기. ( 채널 정보에 필요한 에피소드 목록. )
export const [GET_CH_EPISODES, GET_CH_EPISODES_SUCCESS, GET_CH_EPISODES_FAILURE] = createRequestActionTypes('jpod/GET_CH_EPISODES');
export const getChEpisodes = createAction(GET_CH_EPISODES, ({ chnlSeq }) => ({ chnlSeq }));

// 채널 등록, 수정 처리.
export const [SAVE_JPOD_EPISODE, SAVE_JPOD_EPISODE_SUCCESS, SAVE_JPOD_EPISODE_FAILURE] = createRequestActionTypes('jpod/SAVE_JPOD_EPISODE');
export const saveJpodEpisode = createAction(SAVE_JPOD_EPISODE, ({ chnlSeq, epsdSeq, episodeinfo, callback }) => ({ chnlSeq, epsdSeq, episodeinfo, callback }));
