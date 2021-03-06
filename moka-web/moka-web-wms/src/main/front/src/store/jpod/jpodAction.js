import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 초기화
 */
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
// 채널 > 팟티 목록 조회
export const CLEAR_PODTY_CHNL = 'jpod/CLEAR_PODTY_CHNL';
export const clearPodtyChnl = createAction(CLEAR_PODTY_CHNL);
export const [GET_PODTY_CHNL_LIST, GET_PODTY_CHNL_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_PODTY_CHNL_LIST');
export const getPodtyChnlList = createAction(GET_PODTY_CHNL_LIST, ({ callback }) => ({ callback }));

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
// 에피소드 > 팟티 목록 조회
export const CLEAR_PODTY_EPSD = 'jpod/CLEAR_PODTY_EPSD';
export const clearPodtyEpsd = createAction(CLEAR_PODTY_EPSD);
export const [GET_PODTY_EPSD_LIST, GET_PODTY_EPSD_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_PODTY_EPSD_LIST');
export const getPodtyEpsdList = createAction(GET_PODTY_EPSD_LIST, ({ castSrl, callback }) => ({ castSrl, callback }));

/**
 * 팟캐스트 관련
 */
export const CLEAR_PODCAST = 'jpod/CLEAR_PODCAST';
export const clearPodcast = createAction(CLEAR_PODCAST);
export const CHANGE_PODCAST_SEARCH_OPTION = 'jpod/CHANGE_PODCAST_SEARCH_OPTION';
export const changePodcastSearchOption = createAction(CHANGE_PODCAST_SEARCH_OPTION, (search) => search);
// 팟캐스트 목록
export const [GET_PODCAST_LIST, GET_PODCAST_LIST_SUCCESS] = createRequestActionTypes('jpod/GET_PODCAST_LIST');
export const getPodcastList = createAction(GET_PODCAST_LIST, ({ search, callback }) => ({ search, callback }));
// 팟캐스트 저장
export const SAVE_PODCAST = 'jpod/SAVE_PODCAST';
export const savePodcast = createAction(SAVE_PODCAST, ({ ovpdata, callback }) => ({ ovpdata, callback }));

/**
 * 공지 게시판 관련 액션
 */
export const CLEAR_JPOD_NOTICE_CONTENTS = 'jpod/CLEAR_JPOD_NOTICE_CONTENTS';
export const clearJpodNoticeContents = createAction(CLEAR_JPOD_NOTICE_CONTENTS);
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

// J팟 공지 게시글 저장 (등록, 수정)
export const SAVE_JPOD_NOTICE_CONTENTS = 'jpod/SAVE_JPOD_NOTICE_CONTENTS';
export const saveJpodBoardContents = createAction(SAVE_JPOD_NOTICE_CONTENTS, ({ boardContents, callback }) => ({ boardContents, callback }));

// J팟 공지 게시글 삭제
export const DELETE_JPOD_NOTICE_CONTENTS = 'board/DELETE_JPOD_NOTICE_CONTENTS';
export const deleteJpodNoticeContents = createAction(DELETE_JPOD_NOTICE_CONTENTS, ({ boardId, boardSeq, callback }) => ({ boardId, boardSeq, callback }));

// J팟 공지 게시글 답변 저장
export const SAVE_JPOD_NOTICE_REPLY = 'board/SAVE_JPOD_NOTICE_REPLY';
export const saveJpodNoticeReply = createAction(SAVE_JPOD_NOTICE_REPLY, ({ boardId, parentBoardSeq, boardSeq, contents, callback }) => ({
    boardId,
    parentBoardSeq,
    boardSeq,
    contents,
    callback,
}));
