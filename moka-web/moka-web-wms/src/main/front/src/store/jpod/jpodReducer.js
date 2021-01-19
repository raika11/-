import { handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import { PAGESIZE_OPTIONS } from '@/constants';
import {
    CLEAR_STORE,
    CLEAR_REPORTER,
    GET_REPORTER_LIST_SUCCESS,
    CHANGE_REPORTER_SEARCH_OPTION,
    SELECT_REPORTER,
    CLEAR_CHANNEL_PODTY,
    GET_CHANNEL_PODTY_LIST_SUCCESS,
    SELECT_CHANNEL_PODTY,
    CHANGE_JPOD_SEARCH_OPTION,
    GET_CHANNELS_SUCCESS,
    GET_CHANNEL_INFO_SUCCESS,
    CLEAR_CHANNEL_INFO,
    CHANGE_EPISODES_SEARCH_OPTION,
    GET_EPISODES_SUCCESS,
    CLEAR_EPISODE_INFO,
    GET_EPISODES_INFO_SUCCESS,
    CLEAR_PODTY_EPISODE,
    CHANGE_PODTY_EPISODE_CASTSRL,
    GET_EPISODE_GUBUN_CHANNELS_SUCCESS,
    GET_PODTY_EPISODE_LIST_SUCCESS,
    SELECT_PODTY_EPISODE,
    GET_BRIGHT_OVP_SUCCESS,
    CLEAR_BRIGHT_OVP,
    SELECT_BRIGHTOVP,
    CHANGE_BRIGHTOVP_SEARCH_OPTION,
} from './jpodAction';

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
            chnlSdt: moment().format('YYYY-MM-DD'), // 채널 개설일
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
                usedYn: 'Y',
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
            jpodType: 'A',
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
        },
        channel: {
            search: {
                page: 0,
                sort: 'chnlSeq,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                useTotal: 'Y',
            },
            list: [],
        },
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
        [CLEAR_STORE]: () => initialState,
        // 진행자(기자) 검색 모달 리스트.
        [GET_REPORTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reporter.list = body.list;
                draft.reporter.total = body.totalCnt;
            });
        },
        // 진행자 검색 모달.
        [CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.selectReporter = initialState.selectReporter;
            });
        },
        // 기자 검색 모달 검색 옵션 처리.
        [CHANGE_REPORTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reporter.search = payload;
            });
        },
        // 모달에서 본창으로 값 전달할(진행자 선택) store
        [SELECT_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectReporter = payload;
            });
        },
        // 팟티 채널 검색 모달.
        [CLEAR_CHANNEL_PODTY]: (state) => {
            return produce(state, (draft) => {
                draft.podtyChannel = initialState.podtyChannel;
            });
        },
        // 팟티 검색 모달 리스트.
        [GET_CHANNEL_PODTY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyChannel.list = body.list;
                draft.podtyChannel.total = body.totalCnt;
            });
        },
        // 팟티검색 모달에서 선택시 본창으로 값 전달할 스테이트
        [SELECT_CHANNEL_PODTY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyChannel = payload;
            });
        },
        // 팟티 검색 모달창 검색 옵션 처리.
        [CHANGE_JPOD_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.search = payload;
            });
        },
        // 채널 리스트
        [GET_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.list = body.list;
                draft.channel.jpod.total = body.totalCnt;
            });
        },
        // 채널 리스트에서 클릭시 데이터 가지고 오기.
        [GET_CHANNEL_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = body;
            });
        },
        // 채널 저장 수정 용 스토어 초기화.
        [CLEAR_CHANNEL_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = initialState.channel.channelInfo;
            });
        },
        // 에피소드 검색 옵션 처리.
        [CHANGE_EPISODES_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.search = payload;
            });
        },
        // 에피소드 리스트.
        [GET_EPISODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.list = body.list;
                draft.episode.episodes.total = body.totalCnt;
            });
        },
        // 에피소드 정보 초기화 리스트.
        [CLEAR_EPISODE_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = initialState.episode.episodeInfo;
            });
        },
        // 에피소드 조회 성공.
        [GET_EPISODES_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = body;
            });
        },

        // 팟티 에피소드 리셋.
        [CLEAR_PODTY_EPISODE]: (state) => {
            return produce(state, (draft) => {
                draft.podtyEpisode = initialState.podtyEpisode;
            });
        },
        [CHANGE_PODTY_EPISODE_CASTSRL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.castSrl = payload;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [GET_EPISODE_GUBUN_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.channel.list = body.list;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [GET_PODTY_EPISODE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.list = body.list;
                draft.podtyEpisode.total = body.totalCnt;
            });
        },
        // 에피소드 에서 사용할 채널 목록( 검색 , 등록, 수정)
        [SELECT_PODTY_EPISODE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyEpisode = payload;
            });
        },
        // 브라이트 코브 초기화.
        [CLEAR_BRIGHT_OVP]: (state) => {
            return produce(state, (draft) => {
                draft.brightOvp = initialState.brightOvp;
            });
        },
        // 브라이트 코브 목록.
        [GET_BRIGHT_OVP_SUCCESS]: (state, { payload: { list, total } }) => {
            return produce(state, (draft) => {
                draft.brightOvp.list = list;
                draft.brightOvp.total = total;
            });
        },
        // 브라이트 코브 목록.
        [SELECT_BRIGHTOVP]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectBrightOvp = payload;
            });
        },
        // 기자 검색 모달 검색 옵션 처리.
        [CHANGE_BRIGHTOVP_SEARCH_OPTION]: (state, { payload }) => {
            console.log(payload);
            return produce(state, (draft) => {
                // draft.brightOvp.search = payload;
            });
        },
    },
    initialState,
);
