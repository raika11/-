import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'jpod/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

/**
 * 모든 채널을 조회
 * 채널별 에피소드, 채널별 공지 등
 */
export const [GET_TOTAL_CHNL_LIST, GET_TOTAL_CHNL_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_TOTAL_CHNL_LIST');
export const getTotalChnlList = createAction(GET_TOTAL_CHNL_LIST, () => {});

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
// 채널 > 에피소드탭 목록 조회
export const [GET_CHNL_EPSD_LIST, GET_CHNL_EPSD_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_CHNL_EPSD_LIST');
export const getChnlEpsdList = createAction(GET_CHNL_EPSD_LIST, ({ search, callback }) => ({ search, callback }));

/**
 * 에피소드 관련 액션
 */
export const CLEAR_EPSD = 'jpod/CLEAR_EPSD';
export const clearEpsd = createAction(CLEAR_EPSD);
export const CHANGE_EPSD_SEARCH_OPTION = 'jpod/CHANGE_EPSD_SEARCH_OPTION';
export const changeEpsdSearchOption = createAction(CHANGE_EPSD_SEARCH_OPTION, (search) => search);
export const CHANGE_EPSD_INVALID_LIST = 'jpod/CHANGE_EPSD_INVALID_LIST';
export const changeEpsdInvalidList = createAction(CHANGE_EPSD_INVALID_LIST, (invalidList) => invalidList);
// 에피소드 목록
export const [GET_EPSD_LIST, GET_EPSD_LIST_SUCCESS, GET_EPSD_LIST_FAILURE] = createRequestActionTypes('jpod/GET_EPSD_LIST');
export const getEpsdList = createAction(GET_EPSD_LIST, ({ search, callback }) => ({ search, callback }));
// 에피소드 정보
export const [GET_EPSD, GET_EPSD_SUCCESS, GET_EPSD_FAILURE] = createRequestActionTypes('jpod/GET_EPSD');
export const getEpsd = createAction(GET_EPSD, ({ chnlSeq, epsdSeq, callback }) => ({ chnlSeq, epsdSeq, callback }));
// 에피소드 저장
export const SAVE_EPSD = 'jpod/SAVE_EPSD';
export const saveEpsd = createAction(SAVE_EPSD, ({ epsd, callback }) => ({ epsd, callback }));

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

/**
 * 공지 게시판 관련 액션
 */
export const CLEAR_JPOD_BOARD_CONTENTS = 'jpod/CLEAR_JPOD_BOARD_CONTENTS';
export const clearJpodBoardContents = createAction(CLEAR_JPOD_BOARD_CONTENTS);
export const CHANGE_JPOD_NOTICE_SEARCH_OPTION = 'jpod/CHANGE_JPOD_NOTICE_SEARCH_OPTION';
export const changeJpodNoticeSearchOption = createAction(CHANGE_JPOD_NOTICE_SEARCH_OPTION, (search) => search);

// J팟 채널 게시판을 조회
export const [GET_JPOD_BOARD, GET_JPOD_BOARD_SUCCESS] = createRequestActionTypes('jpod/GET_JPOD_BOARD');
export const getJpodBoard = createAction(GET_JPOD_BOARD);

// 게시판 channalType목록 조회
export const [GET_JPOD_CHANNEL_LIST, GET_JPOD_CHANNEL_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_JPOD_CHANNEL_LIST');
export const getJpodChannelList = createAction(GET_JPOD_CHANNEL_LIST);

// J팟 공지 게시글 목록 조회
export const [GET_JPOD_NOTICE_LIST, GET_JPOD_NOTICE_LIST_SUCCESS, GET_JPOD_NOTICE_LIST_FAILURE] = createRequestActionTypes('jpod/GET_JPOD_NOTICE_LIST');
export const getJpodNoticeList = createAction(GET_JPOD_NOTICE_LIST, (...actions) => actions);

// J팟 공지 게시글 상세 조회
export const [GET_JPOD_NOTICE_CONTENTS, GET_JPOD_NOTICE_CONTENTS_SUCCESS] = createRequestActionTypes('jpod/GET_JPOD_NOTICE_CONTENTS');
export const getJpodNoticeContents = createAction(GET_JPOD_NOTICE_CONTENTS, ({ boardId, boardSeq }) => ({ boardId, boardSeq }));
