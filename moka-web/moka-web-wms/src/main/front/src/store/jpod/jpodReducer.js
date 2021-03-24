import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';
import * as act from './jpodAction';

export const initialState = {
    channel: {
        total: 0,
        list: [],
        search: {
            page: 0,
            sort: 'chnlSeq,desc',
            size: PAGESIZE_OPTIONS[0],
            usedYn: '',
            startDt: null,
            endDt: null,
            keyword: '',
        },
        searchTypeList: [
            { id: '', name: '전체' },
            { id: 'Y', name: '사용' },
            { id: 'N', name: '미사용' },
        ],
        channel: {
            usedYn: 'Y', // 사용유무
            chnlNm: '', // 채널명
            chnlMemo: '', // 채널소개
            podtyUrl: '', // 팟티 채널
            chnlSdt: null, // 채널 개설일
            chnlEdt: null, // 채널 종료일
            chnlDy: '', // 채널 방송 요일
            podtyChnlSrl: `0`, // 파치태널SRL
            chnlImgFile: null, // 커버 파일
            chnlThumbFile: null, // 썸네일 파일
            chnlImgMobFile: null, // 모바일 파일
            regDt: '',
            seasonCnt: 0,
            seasonNm: null,
            keywords: [],
            members: [],
            episodeStat: {
                lastEpsoNo: null,
                unusedCnt: 0,
                usedCnt: 0,
            },
        },
        invalidList: [],
        channelInfoEpisode: {
            list: [],
        },
    },
    // 진행자 기본값
    initMember: {
        chnlSeq: '',
        desc: '',
        epsdSeq: '',
        memDiv: '',
        memMemo: '',
        memNm: '',
        memRepSeq: null,
        nickNm: '',
        seqNo: '',
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
            articles: [],
            chnlSeq: '',
            epsdDate: '',
            epsdFile: null,
            epsdMemo: '',
            epsdNm: '',
            epsdNo: '',
            epsdSeq: 0,
            jpodType: '',
            katalkImg: '',
            keywords: [],
            likeCnt: 0,
            members: [],
            playCnt: 0,
            playTime: '',
            podtyEpsdSrl: 0,
            replyCnt: 0,
            scbCnt: 0,
            seasonNo: 0,
            shareCnt: 0,
            shrImg: '',
            usedYn: 'Y',
            viewCnt: 0,
        },
        channel: {
            search: {
                page: 0,
                sort: 'chnlSeq,desc',
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
        selectBoard: {
            answYn: 'N',
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
        castSrl: '',
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
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 채널 관련
         */
        [act.CLEAR_CHNL]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channel = initialState.channel.channel;
            });
        },
        [act.CHANGE_CHNL_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.invalidList = payload;
            });
        },
        [act.CHANGE_CHNL_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.search = payload;
            });
        },
        // 채널 목록
        [act.GET_CHNL_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.list = body.list;
                draft.channel.total = body.totalCnt;
            });
        },
        // 채널 상세 정보
        [act.GET_CHNL_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channel = body;
            });
        },
        /**
         * 이 뒤부터 정리 필요함
         */
        // 진행자(기자) 검색 모달 리스트.
        [act.GET_REPORTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.reporter.list = body.list;
                draft.reporter.total = body.totalCnt;
            });
        },
        // 진행자 검색 모달
        [act.CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.reporter = initialState.reporter;
                draft.selectReporter = initialState.selectReporter;
            });
        },
        // 기자 검색 모달 검색 옵션 처리
        [act.CHANGE_REPORTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.reporter.search = payload;
            });
        },
        // 모달에서 본창으로 값 전달할(진행자 선택) store
        [act.SELECT_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectReporter = payload;
            });
        },
        // 팟티 채널 검색 모달
        [act.CLEAR_CHANNEL_PODTY]: (state) => {
            return produce(state, (draft) => {
                draft.podtyChannel = initialState.podtyChannel;
            });
        },
        // 팟티 검색 모달 리스트
        [act.GET_CHANNEL_PODTY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyChannel.list = body.list;
                draft.podtyChannel.total = body.totalCnt;
            });
        },
        // 팟티검색 모달에서 선택시 본창으로 값 전달할 스테이트
        [act.SELECT_CHANNEL_PODTY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyChannel = payload;
            });
        },
        // 팟티 검색 모달창 검색 옵션 처리
        [act.CHANGE_JPOD_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.search = payload;
            });
        },
        // 채널 리스트
        [act.GET_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.list = body.list;
                draft.channel.jpod.total = body.totalCnt;
            });
        },
        // 채널 리스트에서 클릭시 데이터 가지고 오기
        [act.GET_CHANNEL_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = body;
            });
        },
        // 채널 저장 수정 용 스토어 초기화
        [act.CLEAR_CHANNEL_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = initialState.channel.channelInfo;
            });
        },
        // 에피소드 검색 옵션 처리
        [act.CHANGE_EPISODES_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.search = payload;
            });
        },
        // 에피소드 리스트
        [act.GET_EPISODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodes.list = body.list;
                draft.episode.episodes.total = body.totalCnt;
            });
        },
        // 에피소드 정보 초기화 리스트
        [act.CLEAR_EPISODE_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = initialState.episode.episodeInfo;
            });
        },
        // 에피소드 조회 성공
        [act.GET_EPISODES_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episodeInfo = body;
            });
        },

        // 팟티 에피소드 리셋
        [act.CLEAR_PODTY_EPISODE]: (state) => {
            return produce(state, (draft) => {
                draft.podtyEpisode = initialState.podtyEpisode;
            });
        },
        [act.CHANGE_PODTY_EPISODE_CASTSRL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.castSrl = payload;
            });
        },
        // 에피소드 에서 사용할 채널 목록(검색 , 등록, 수정)
        [act.GET_EPISODE_GUBUN_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.channel.list = body.list;
            });
        },
        // 에피소드 에서 사용할 채널 목록(검색 , 등록, 수정)
        [act.GET_PODTY_EPISODE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.podtyEpisode.list = body.list;
                draft.podtyEpisode.total = body.totalCnt;
            });
        },
        // 에피소드 에서 사용할 채널 목록(검색 , 등록, 수정)
        [act.SELECT_PODTY_EPISODE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectPodtyEpisode = payload;
            });
        },
        // 브라이트 코브 초기화
        [act.CLEAR_BRIGHT_OVP]: (state) => {
            return produce(state, (draft) => {
                draft.brightOvp = initialState.brightOvp;
            });
        },
        // 브라이트 코브 목록
        [act.GET_BRIGHT_OVP_SUCCESS]: (state, { payload: { list, total } }) => {
            return produce(state, (draft) => {
                draft.brightOvp.list = list;
                draft.brightOvp.total = total;
            });
        },
        // 브라이트 코브 목록
        [act.SELECT_BRIGHTOVP]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.selectBrightOvp = payload;
            });
        },
        // 기자 검색 모달 검색 옵션 처리
        [act.CHANGE_BRIGHTOVP_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                // draft.brightOvp.search = payload;
            });
        },
        [act.GET_CH_EPISODES_SUCCESS]: (state, { payload: { body } }) => {
            // console.log(payload);
            return produce(state, (draft) => {
                draft.channel.channelInfoEpisode.list = body.list;
            });
        },
        [act.CHANGE_JPOD_NOTICE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.jpodNotices.search = payload;
            });
        },
        [act.GET_JPOD_NOTICE_SUCCESS]: (state, { payload: { list, totalCnt } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.jpodNotices.list = list;
                draft.jpodNotice.jpodNotices.total = totalCnt;
            });
        },
        [act.GET_BOARD_CHANNEL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.channelList = payload;
            });
        },
        [act.GET_JPOD_BOARD_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.boardList = payload;
            });
        },
        [act.GET_BOARD_CONTENTS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.noticeInfo = body;
            });
        },
        [act.CHANGE_SELECT_BOARD]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.selectBoard = payload;
            });
        },
        [act.CLEAR_SELECT_BOARD]: (state) => {
            return produce(state, (draft) => {
                draft.jpodNotice.selectBoard = initialState.jpodNotice.selectBoard;
            });
        },
    },
    initialState,
);
