import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';
import * as jpodAction from './jpodAction';

export const initialState = {
    channel: {
        jpod: {
            total: 0,
            list: [],
            search: {
                page: 0,
                sort: 'chnlSeq,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: '',
                startDt: '',
                endDt: '',
                keyword: '',
            },
        },
        channelInfo: {
            usedYn: 'Y', // 사용유무
            chnlNm: '', // 채널명
            chnlMemo: '', // 채널소개
            chnlSdt: '', // 채널 개설일
            chnlImg: '', // 커버 이미지.
            chnlThumb: '', // 썸네일 이미지
            podtyUrl: '', // 파치채널
            chnlEdt: '', // 채널 종료일
            chnlDy: 0, // 채널 방송 요일.
            chnlImgMob: '', // 모바일용 이미지
            podtyChnlSrl: `0`, // 파치태널SRL
            chnlImgFile: '', // 커버 이미지
            chnlThumbFile: '', // 썸네일
            chnlImgMobFile: '', // 모바일.
            episodeState: {
                lastEpsoNo: null,
                unusedCnt: 0,
                usedCnt: 0,
            },
        },
        channelInfoEpisode: {
            list: [],
        },
    },
    episode: {
        episodes: {
            total: 0,
            list: [],
            search: {
                page: 0,
                sort: 'epsdSeq,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: '',
                startDt: '',
                endDt: '',
                keyword: '',
                chnlSeq: '',
                podtyChnlSrl: '',
            },
        },
        episodeInfo: {
            chnlSeq: '',
            epsdDate: '',
            epsdFile: null,
            epsdMemo: '',
            epsdNm: '',
            epsdNo: '',
            epsdSeq: 0,
            jpodType: '',
            katalkImg: '',
            likeCnt: 0,
            playCnt: 0,
            playTime: '',
            podtyEpsdSrl: 0,
            podtyChnlSrl: '',
            replyCnt: 0,
            scbCnt: 0,
            shareCnt: 0,
            shrImg: '',
            usedYn: 'Y',
            viewCnt: 0,
            seasonNo: '',
        },
        channel: {
            search: {
                page: 0,
                sort: 'chnlSeq,desc',
                // size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                useTotal: 'Y',
            },
            list: [],
        },
    },
    jpodNotice: {
        jpodNotices: {
            total: 0,
            list: [],
            search: {
                page: 0,
                sort: 'boardId,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                searchType: '',
                keyword: '',
                delYn: 'N',
            },
        },
        boardList: [],
        channelList: [],
        noticeInfo: {},
    },
    reporter: {
        total: 0,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'repSeq,asc',
            searchType: 'all',
            keyword: '',
            usePaging: 'Y',
        },
    },
    podtyChannel: {
        total: 0,
        list: [],
    },
    podtyEpisode: {
        castSrl: 0,
        total: 0,
        list: [],
    },
    brightOvp: {
        total: 0,
        list: [],
        search: {
            page: 0,
            size: 20,
            searchType: 'all',
            keyword: '',
            useTotal: 'Y',
            folderId: '',
        },
    },
    selectReporter: null,
    selectPodtyChannel: {},
    selectPodtyEpisode: {},
    selectBrightOvp: {},
};

export default handleActions(
    {
        // 전체 초기화.
        [jpodAction.CLEAR_STORE]: () => initialState,
        // 진행자(기자) 검색 모달 리스트.
        [jpodAction.GET_REPORTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reporter.list = body.list;
                draft.reporter.total = body.totalCnt;
            });
        },
        // 진행자 검색 모달.
        [jpodAction.CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.selectReporter = initialState.selectReporter;
            });
        },
        // 기자 검색 모달 검색 옵션 처리.
        [jpodAction.CHANGE_REPORTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reporter.search = payload;
            });
        },
        // 모달에서 본창으로 값 전달할(진행자 선택) store
        [jpodAction.SELECT_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectReporter = payload;
            });
        },
        // 팟티 채널 검색 모달.
        [jpodAction.CLEAR_CHANNEL_PODTY]: (state) => {
            return produce(state, (draft) => {
                draft.podtyChannel = initialState.podtyChannel;
            });
        },
        // 팟티 검색 모달 리스트.
        [jpodAction.GET_CHANNEL_PODTY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyChannel.list = body.list;
                draft.podtyChannel.total = body.totalCnt;
            });
        },
        // 팟티검색 모달에서 선택시 본창으로 값 전달할 스테이트
        [jpodAction.SELECT_CHANNEL_PODTY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyChannel = payload;
            });
        },
        // 팟티 검색 모달창 검색 옵션 처리.
        [jpodAction.CHANGE_JPOD_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.search = payload;
            });
        },
        // 채널 리스트
        [jpodAction.GET_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.list = body.list;
                draft.channel.jpod.total = body.totalCnt;
            });
        },
        // 채널 리스트에서 클릭시 데이터 가지고 오기.
        [jpodAction.GET_CHANNEL_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = body;
            });
        },
        // 채널 저장 수정 용 스토어 초기화.
        [jpodAction.CLEAR_CHANNEL_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = initialState.channel.channelInfo;
            });
        },
        // 에피소드 검색 옵션 처리.
        [jpodAction.CHANGE_EPISODES_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.search = payload;
            });
        },
        // 에피소드 리스트.
        [jpodAction.GET_EPISODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.list = body.list;
                draft.episode.episodes.total = body.totalCnt;
            });
        },
        // 에피소드 정보 초기화 리스트.
        [jpodAction.CLEAR_EPISODE_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = initialState.episode.episodeInfo;
            });
        },
        // 에피소드 조회 성공.
        [jpodAction.GET_EPISODES_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = body;
            });
        },

        // 팟티 에피소드 리셋.
        [jpodAction.CLEAR_PODTY_EPISODE]: (state) => {
            return produce(state, (draft) => {
                draft.podtyEpisode = initialState.podtyEpisode;
            });
        },
        [jpodAction.CHANGE_PODTY_EPISODE_CASTSRL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.castSrl = payload;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [jpodAction.GET_EPISODE_GUBUN_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.channel.list = body.list;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [jpodAction.GET_PODTY_EPISODE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.list = body.list;
                draft.podtyEpisode.total = body.totalCnt;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [jpodAction.SELECT_PODTY_EPISODE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyEpisode = payload;
            });
        },
        // 브라이트 코브 초기화.
        [jpodAction.CLEAR_BRIGHT_OVP]: (state) => {
            return produce(state, (draft) => {
                draft.brightOvp = initialState.brightOvp;
            });
        },
        // 브라이트 코브 목록.
        [jpodAction.GET_BRIGHT_OVP_SUCCESS]: (state, { payload: { list, total } }) => {
            return produce(state, (draft) => {
                draft.brightOvp.list = list;
                draft.brightOvp.total = total;
            });
        },
        // 브라이트 코브 목록.
        [jpodAction.SELECT_BRIGHTOVP]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectBrightOvp = payload;
            });
        },
        // 기자 검색 모달 검색 옵션 처리.
        [jpodAction.CHANGE_BRIGHTOVP_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                // draft.brightOvp.search = payload;
            });
        },
        [jpodAction.GET_CH_EPISODES_SUCCESS]: (state, { payload: { body } }) => {
            // console.log(payload);
            return produce(state, (draft) => {
                draft.channel.channelInfoEpisode.list = body.list;
            });
        },
        [jpodAction.CHANGE_JPOD_NOTICE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.jpodNotices.search = payload;
            });
        },
        [jpodAction.GET_JPOD_NOTICE_SUCCESS]: (state, { payload: { list, totalCnt } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.jpodNotices.list = list;
                draft.jpodNotice.jpodNotices.total = totalCnt;
            });
        },
        [jpodAction.GET_BOARD_CHANNEL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.channelList = payload;
            });
        },
        [jpodAction.GET_JPOD_BOARD_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.boardList = payload;
            });
        },
        [jpodAction.GET_BOARD_CONTENTS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.noticeInfo = body;
            });
        },
    },
    initialState,
);
