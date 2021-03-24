import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'jpod/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

/**
 * 채널 관련 액션
 */
export const CLEAR_CHNL = 'jpod/CLEAR_CHNL';
export const clearChnl = createAction(CLEAR_CHNL);
export const CHANGE_CHNL_SEARCH_OPTION = 'jpod/CHANGE_CHNL_SEARCH_OPTION';
export const changeChnlSearchOption = createAction(CHANGE_CHNL_SEARCH_OPTION, (search) => search);
export const CHANGE_CHNL_INVALID_LIST = 'jpod/CHANGE_CHNL_INVALID_LIST';
export const changeChnlInvalidList = createAction(CHANGE_CHNL_INVALID_LIST, (invalidList) => invalidList);
// 채널 목록
export const [GET_CHNL_LIST, GET_CHNL_LIST_SUCCESS, GET_CHNL_LIST_FAILURE] = createRequestActionTypes('jpod/GET_CHNL_LIST');
export const getChnlList = createAction(GET_CHNL_LIST, ({ search, callback }) => ({ search, callback }));
// 채널 정보
export const [GET_CHNL, GET_CHNL_SUCCESS, GET_CHNL_FAILURE] = createRequestActionTypes('jpod/GET_CHNL');
export const getChnl = createAction(GET_CHNL, ({ chnlSeq, callback }) => ({ chnlSeq, callback }));
// 채널 저장
export const SAVE_CHNL = 'jpod/SAVE_CHNL';
export const saveChnl = createAction(SAVE_CHNL, ({ chnl, callback }) => ({ chnl, callback }));
// 채널 삭제
export const DELETE_CHNL = createRequestActionTypes('jpod/DELETE_CHNL');
export const deleteChnl = createAction(DELETE_CHNL, ({ chnlSeq, callback }) => ({ chnlSeq, callback }));

/**
 * 에피소드 관련 액션
 */
// 진행자 검색 모달
export const CLEAR_REPORTER = 'jpod/CLEAR_REPORTER';
export const clearReporter = createAction(CLEAR_REPORTER);
export const CHANGE_REPORTER_SEARCH_OPTION = 'jpod/CHANGE_REPORTER_SEARCH_OPTION';
export const changeReporterSearchOption = createAction(CHANGE_REPORTER_SEARCH_OPTION, (actions) => actions);
export const [GET_REPORTER_LIST, GET_REPORTER_LIST_SUCCESS, GET_REPORTER_LIST_FAILURE] = createRequestActionTypes('jpod/GET_REPORTER_LIST');
export const getReporterList = createAction(GET_REPORTER_LIST, (actions) => actions);
export const SELECT_REPORTER = 'jpod/SELECT_REPORTER';
export const selectReporter = createAction(SELECT_REPORTER, (actions) => actions);

/**
 * 팟티검색 모달
 */
export const CLEAR_CHANNEL_PODTY = 'jpod/CLEAR_CHANNEL_PODTY';
export const clearChannelPodty = createAction(CLEAR_CHANNEL_PODTY);
export const [GET_CHANNEL_PODTY_LIST, GET_CHANNEL_PODTY_LIST_SUCCESS, GET_CHANNEL_PODTY_LIST_FAILURE] = createRequestActionTypes('jpod/GET_CHANNEL_PODTY_LIST');
export const getChannelPodtyList = createAction(GET_CHANNEL_PODTY_LIST, (actions) => actions);
export const SELECT_CHANNEL_PODTY = 'jpod/SELECT_CHANNEL_PODTY';
export const selectChannelPodty = createAction(SELECT_CHANNEL_PODTY, (actions) => actions);

/**
 * 팟티 에피소드 모달
 */
export const CLEAR_PODTY_EPISODE = 'jpod/CLEAR_PODTY_EPISODE';
export const clearPodtyEpisode = createAction(CLEAR_PODTY_EPISODE);
export const CHANGE_PODTY_EPISODE_CASTSRL = 'jpod/CHANGE_PODTY_EPISODE_CASTSRL';
export const changePodtyEpisodeCastsrl = createAction(CHANGE_PODTY_EPISODE_CASTSRL, (actions) => actions);
export const [GET_PODTY_EPISODE_LIST, GET_PODTY_EPISODE_LIST_SUCCESS, GET_PODTY_EPISODE_LIST_FAILURE] = createRequestActionTypes('jpod/GET_PODTY_EPISODE_LIST');
export const getPodtyEpisodeList = createAction(GET_PODTY_EPISODE_LIST, (actions) => actions);
export const SELECT_PODTY_EPISODE = 'jpod/SELECT_PODTY_EPISODE';
export const selectPodtyEpisode = createAction(SELECT_PODTY_EPISODE, (actions) => actions);

/**
 * 팟캐스트 모달 > 브라이트 코브 목록 초기화
 */
export const CLEAR_BRIGHT_OVP = 'jpod/CLEAR_BRIGHT_OVP';
export const clearBrightOvp = createAction(CLEAR_BRIGHT_OVP);

/**
 * 팟캐스트 모달 > 브라이트 코브 목록 조회
 */
export const [GET_BRIGHT_OVP, GET_BRIGHT_OVP_SUCCESS, GET_BRIGHT_OVP_FAILURE] = createRequestActionTypes('jpod/GET_BRIGHT_OVP');
export const getBrightOvp = createAction(GET_BRIGHT_OVP, (actions) => actions);
export const SELECT_BRIGHTOVP = 'jpod/SELECT_BRIGHTOVP';
export const selectBrightovp = createAction(SELECT_BRIGHTOVP, (actions) => actions);
export const [SAVE_BRIGHTOVP, SAVE_BRIGHTOVP_SUCCESS, SAVE_BRIGHTOVP_FAILURE] = createRequestActionTypes('jpod/SAVE_BRIGHTOVP');
export const saveBrightovp = createAction(SAVE_BRIGHTOVP, ({ ovpdata, callback }) => ({ ovpdata, callback }));
export const CHANGE_BRIGHTOVP_SEARCH_OPTION = 'jpod/CHANGE_BRIGHTOVP_SEARCH_OPTION';
export const changeBrightovpSearchOption = createAction(CHANGE_BRIGHTOVP_SEARCH_OPTION, (actions) => actions);

/* 채널 */

/**
 * 채널 초기화
 */
export const CLEAR_CHANNELS = 'jpod/CLEAR_CHANNELS';
export const clearChannels = createAction(CLEAR_CHANNELS);

/**
 * 채널 검색 옵션 변경
 */
export const CHANGE_JPOD_SEARCH_OPTION = 'jpod/CHANGE_JPOD_SEARCH_OPTION';
export const changeJpodSearchOption = createAction(CHANGE_JPOD_SEARCH_OPTION, (actions) => actions);

export const [GET_CHANNELS, GET_CHANNELS_SUCCESS, GET_CHANNELS_FAILURE] = createRequestActionTypes('jpod/GET_CHANNELS');
export const getChannels = createAction(GET_CHANNELS, (actions) => actions);

export const CLEAR_CHANNEL_INFO = 'jpod/CLEAR_CHANNEL_INFO';
export const clearChannelInfo = createAction(CLEAR_CHANNEL_INFO);

/**
 * 채널 상세 조회
 */
export const [GET_CHANNEL_INFO, GET_CHANNEL_INFO_SUCCESS, GET_CHANNEL_INFO_FAILURE] = createRequestActionTypes('jpod/GET_CHANNEL_INFO');
export const getChannelInfo = createAction(GET_CHANNEL_INFO, ({ chnlSeq }) => ({ chnlSeq }));

/**
 * 채널 저장
 */
export const [SAVE_JPOD_CHANNEL, SAVE_JPOD_CHANNEL_SUCCESS, SAVE_JPOD_CHANNEL_FAILURE] = createRequestActionTypes('jpod/SAVE_JPOD_CHANNEL');
export const saveJpodChannel = createAction(SAVE_JPOD_CHANNEL, ({ chnlSeq, channelinfo, callback }) => ({ chnlSeq, channelinfo, callback }));

/**
 * 채널 삭제
 */
export const [DELETE_JPOD_CHANNEL] = createRequestActionTypes('jpod/DELETE_JPOD_CHANNEL');
export const deleteJpodChannel = createAction(DELETE_JPOD_CHANNEL, ({ chnlSeq, callback }) => ({ chnlSeq, callback }));

/* 에피소드 */
export const CLEAR_EPISODE = 'jpod/CLEAR_EPISODE';
export const clearEpisode = createAction(CLEAR_EPISODE);

/**
 * 검색 옵션 변경
 */
export const CHANGE_EPISODES_SEARCH_OPTION = 'jpod/CHANGE_EPISODES_SEARCH_OPTION';
export const changeEpisodesSearchOption = createAction(CHANGE_EPISODES_SEARCH_OPTION, (actions) => actions);

/**
 * 채널 목록 조회(등록, 수정, 검색등에 사용)
 */
export const [GET_EPISODE_GUBUN_CHANNELS, GET_EPISODE_GUBUN_CHANNELS_SUCCESS, GET_EPISODE_GUBUN_CHANNELS_FAILURE] = createRequestActionTypes('jpod/GET_EPISODE_GUBUN_CHANNELS');
export const getEpisodeGubunChannels = createAction(GET_EPISODE_GUBUN_CHANNELS, (actions) => actions);

/**
 * 에피소드 목록 조회(에피소드 관리 목록)
 */
export const [GET_EPISODES, GET_EPISODES_SUCCESS, GET_EPISODES_FAILURE] = createRequestActionTypes('jpod/GET_EPISODES');
export const getEpisodes = createAction(GET_EPISODES, (actions) => actions);

/**
 * 에피소드 정보 초기화
 */
export const CLEAR_EPISODE_INFO = 'jpod/CLEAR_EPISODE_INFO';
export const clearEpisodeInfo = createAction(CLEAR_EPISODE_INFO);

/**
 * 에피소드 정보 조회
 */
export const [GET_EPISODES_INFO, GET_EPISODES_INFO_SUCCESS, GET_EPISODES_INFO_FAILURE] = createRequestActionTypes('jpod/GET_EPISODES_INFO');
export const getEpisodesInfo = createAction(GET_EPISODES_INFO, ({ chnlSeq, epsdSeq }) => ({ chnlSeq, epsdSeq }));

/**
 * 에피소드 목록 조회(채널 정보에 필요한 에피소드 목록)
 */
export const [GET_CH_EPISODES, GET_CH_EPISODES_SUCCESS, GET_CH_EPISODES_FAILURE] = createRequestActionTypes('jpod/GET_CH_EPISODES');
export const getChEpisodes = createAction(GET_CH_EPISODES, ({ chnlSeq }) => ({ chnlSeq }));

/**
 * 채널 등록, 수정
 */
export const [SAVE_JPOD_EPISODE, SAVE_JPOD_EPISODE_SUCCESS, SAVE_JPOD_EPISODE_FAILURE] = createRequestActionTypes('jpod/SAVE_JPOD_EPISODE');
export const saveJpodEpisode = createAction(SAVE_JPOD_EPISODE, ({ chnlSeq, epsdSeq, episodeinfo, callback }) => ({ chnlSeq, epsdSeq, episodeinfo, callback }));

/**
 * 공지 게시판
 */

/**
 * 검색 옵션 변경
 */
export const CHANGE_JPOD_NOTICE_SEARCH_OPTION = 'jpod/CHANGE_JPOD_NOTICE_SEARCH_OPTION';
export const changeJpodNoticeSearchOption = createAction(CHANGE_JPOD_NOTICE_SEARCH_OPTION, (actions) => actions);

/**
 * 선택한 보드 정보(설정 정보들 저장)
 */
export const CLEAR_SELECT_BOARD = 'jpod/CLEAR_SELECT_BOARD';
export const clearSelectBoard = createAction(CLEAR_SELECT_BOARD);

export const CHANGE_SELECT_BOARD = 'jpod/CHANGE_SELECT_BOARD';
export const changeSelectBoard = createAction(CHANGE_SELECT_BOARD, (actions) => actions);

/**
 * j팟 게시판 목록 조회
 */
export const [GET_JPOD_BOARD, GET_JPOD_BOARD_SUCCESS, GET_JPOD_BOARD_FAILURE] = createRequestActionTypes('jpod/GET_JPOD_BOARD');
export const getJpodBoard = createAction(GET_JPOD_BOARD);

/**
 * j팟 공지 게시글 목록 조회
 */
export const [GET_JPOD_NOTICE, GET_JPOD_NOTICE_SUCCESS, GET_JPOD_NOTICE_FAILURE] = createRequestActionTypes('jpod/GET_JPOD_NOTICE');
export const getJpodNotice = createAction(GET_JPOD_NOTICE);

export const [GET_BOARD_CONTENTS, GET_BOARD_CONTENTS_SUCCESS, GET_BOARD_CONTENTS_FAILURE] = createRequestActionTypes('jpod/GET_BOARD_CONTENTS');
export const getBoardContents = createAction(GET_BOARD_CONTENTS, ({ boardId, boardSeq }) => ({ boardId, boardSeq }));

/**
 * 에피소드 정보 초기화
 */
export const CLEAR_BOARD_CONTENTS = 'jpod/CLEAR_BOARD_CONTENTS';
export const clearBoardContents = createAction(CLEAR_BOARD_CONTENTS);

/**
 * 게시판 channalType 별 목록 가지고 오기. ( store 를 거치지 않고 call back 으로 목록 전달.)
 */
export const [GET_BOARD_CHANNEL_LIST, GET_BOARD_CHANNEL_LIST_SUCCESS, GET_BOARD_CHANNEL_LIST_FAILURE] = createRequestActionTypes('jpod/GET_BOARD_CHANNEL_LIST');
export const getBoardChannelList = createAction(GET_BOARD_CHANNEL_LIST);
