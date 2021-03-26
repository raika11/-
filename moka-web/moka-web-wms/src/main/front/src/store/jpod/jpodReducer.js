import { handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '@/constants';
import * as act from './jpodAction';

export const initialState = {
    // 채널
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
            podtyUrl: '', // 팟티채널
            chnlSdt: null, // 채널 개설일
            chnlEdt: null, // 채널 종료일
            chnlDy: '', // 채널 방송 요일
            podtyChnlSrl: `0`, // 팟티채널 Srl
            chnlImgFile: null, // 커버 파일
            chnlThumbFile: null, // 썸네일 파일
            chnlImgMobFile: null, // 모바일 파일
            keywords: [],
            members: [],
            seasonCnt: 0,
            episodeStat: {
                lastEpsoNo: null,
                unusedCnt: 0,
                usedCnt: 0,
            },
        },
        invalidList: [],
        channelEpisode: {
            // 채널 > 에피소드
            list: [],
            search: { page: 0, sort: 'chnlSeq,desc', size: 20, chnlSeq: null },
        },
        podty: {
            total: 0,
            list: [],
        },
    },
    // 모든 채널 목록 (에피소드의 selectbox, 공지의 selectbox)
    totalChannel: {
        search: {
            page: 0,
            sort: 'chnlSeq,desc',
            usedYn: 'Y',
            useTotal: 'Y',
        },
        list: [],
    },
    // 에피소드
    episode: {
        total: 0,
        list: [],
        search: {
            page: 0,
            sort: 'epsdSeq,desc',
            size: PAGESIZE_OPTIONS[0],
            usedYn: '',
            startDt: null,
            endDt: null,
            keyword: '',
            chnlSeq: null,
            podtyChnlSrl: null,
        },
        searchTypeList: [
            { id: '', name: '사용여부전체' },
            { id: 'Y', name: '사용' },
            { id: 'N', name: '미사용' },
        ],
        episode: {
            articles: [],
            epsdFile: null,
            epsdSeq: 0,
            keywords: [],
            likeCnt: 0,
            members: [],
            playCnt: 0,
            podtyEpsdSrl: 0,
            replyCnt: 0,
            scbCnt: 0,
            seasonNo: 0,
            shareCnt: 0,
            usedYn: 'Y',
            viewCnt: 0,
        },
        invalidList: [],
        podty: {
            total: 0,
            list: [],
        },
    },
    // 공지 게시판
    jpodNotice: {
        jpodBoard: {},
        channelList: [],
        total: 0,
        list: [],
        error: null,
        search: {
            boardId: null,
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            startDt: null,
            endDt: null,
            usedYn: 'Y',
            delYn: 'N',
            channelId: '',
            keyword: '',
        },
        contents: {
            boardSeq: null,
            boardId: null,
            parentBoardSeq: null,
            regName: '',
            regId: '',
            depth: 0,
            indent: 0,
            viewCnt: 0,
            recomCnt: 0,
            decomCnt: 0,
            declareCnt: 0,
            delYn: 'N',
            regIp: '',
            boardInfo: {},
            attaches: [],
            channelId: 0,
            titlePrefix1: '',
            titlePrefix2: '',
            title: '',
            ordNo: 99,
            content: '',
            pwd: null,
            addr: null,
            pushReceiveYn: 'N',
            emailReceiveYn: 'N',
            appOs: null,
            devDiv: null,
            token: null,
            email: '',
            mobilePhone: null,
            url: null,
            jpodChannel: null,
            regDt: null,
            modDt: null,
            maxDepth: 0,
        },
        reply: {
            addr: null,
            appOs: null,
            attaches: [],
            boardId: null,
            boardInfo: {},
            boardSeq: null,
            channelId: 0,
            content: '',
            declareCnt: 0,
            decomCnt: 0,
            delYn: 'N',
            depth: 0,
            devDiv: null,
            email: '',
            emailReceiveYn: 'N',
            indent: 0,
            jpodChannel: null,
            maxDepth: 0,
            mobilePhone: null,
            modDt: null,
            ordNo: 99,
            parentBoardSeq: null,
            pushReceiveYn: 'N',
            pwd: null,
            recomCnt: 0,
            regDt: null,
            regId: '',
            regIp: '',
            regName: '',
            title: '',
            titlePrefix1: '',
            titlePrefix2: '',
            token: null,
            url: null,
            viewCnt: 0,
        },
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
    selectBrightOvp: {},
};

export default handleActions(
    {
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 모든 채널 목록 조회
         */
        [act.GET_TOTAL_CHNL_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.totalChannel.list = body.list;
            });
        },
        /**
         * 채널 관련
         */
        [act.CLEAR_CHNL]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channel = initialState.channel.channel;
                draft.channel.channelEpisode = initialState.channel.channelEpisode;
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
        /**
         * 채널 목록
         */
        [act.GET_CHNL_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.list = body.list;
                draft.channel.total = body.totalCnt;
            });
        },
        /**
         * 채널 상세 정보
         */
        [act.GET_CHNL_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channel = body;
            });
        },
        /**
         * 채널 > 에피소드 리스트
         */
        [act.GET_CHNL_EPSD_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channelEpisode.list = body.list;
            });
        },
        /**
         * 채널 > 팟티 관련
         */
        [act.CLEAR_PODTY_CHNL]: (state) => {
            return produce(state, (draft) => {
                draft.channel.podty = initialState.channel.podty;
            });
        },
        [act.GET_PODTY_CHNL_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.podty.list = body.list;
                draft.channel.podty.total = body.totalCnt;
            });
        },
        /**
         * 에피소드 관련
         */
        [act.CLEAR_EPSD]: (state) => {
            return produce(state, (draft) => {
                draft.episode.episode = initialState.episode.episode;
            });
        },
        [act.CHANGE_EPSD_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.episode.search = payload;
            });
        },
        [act.CHANGE_EPSD_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.episode.invalidList = payload;
            });
        },
        [act.GET_EPSD_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.list = body.list;
                draft.episode.total = body.totalCnt;
            });
        },
        [act.GET_EPSD_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.episode = body;
            });
        },
        /**
         * 에피소드 > 팟티 관련
         */
        [act.CLEAR_PODTY_EPSD]: (state) => {
            return produce(state, (draft) => {
                draft.episode.podty = initialState.episode.podty;
            });
        },
        [act.GET_PODTY_EPSD_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.episode.podty.list = body.list;
                draft.episode.podty.total = body.totalCnt;
            });
        },

        /**
         * 이 뒤부터 정리 필요함
         */
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
        [act.CHANGE_BRIGHTOVP_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                // draft.brightOvp.search = payload;
            });
        },
        /**
         * J팟 공지 게시판 관련
         */
        [act.CLEAR_JPOD_NOTICE_CONTENTS]: (state) => {
            return produce(state, (draft) => {
                draft.jpodNotice.contents = initialState.jpodNotice.contents;
            });
        },
        [act.CHANGE_JPOD_NOTICE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.search = payload;
            });
        },
        [act.GET_JPOD_BOARD_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.jpodBoard = body.list[0];
                draft.jpodNotice.search.boardId = body.list[0].boardId;
            });
        },
        [act.GET_JPOD_CHANNEL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.channelList = payload;
            });
        },
        [act.GET_JPOD_NOTICE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.total = body.totalCnt;
                draft.jpodNotice.list = body.list;
                draft.jpodNotice.error = initialState.jpodNotice.error;
            });
        },
        [act.GET_JPOD_NOTICE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.jpodNotice.total = initialState.jpodNotice.total;
                draft.jpodNotice.list = initialState.jpodNotice.list;
                draft.jpodNotice.error = payload;
            });
        },
        [act.GET_JPOD_NOTICE_CONTENTS_SUCCESS]: (state, { payload: { body } }) => {
            const { boardSeq, parentBoardSeq } = body;
            if (boardSeq === parentBoardSeq) {
                return produce(state, (draft) => {
                    draft.jpodNotice.contents = body;
                    draft.jpodNotice.reply = initialState.jpodNotice.reply;
                });
            } else {
                return produce(state, (draft) => {
                    draft.jpodNotice.contents = initialState.jpodNotice.contents;
                    draft.jpodNotice.reply = body;
                });
            }
        },
    },
    initialState,
);
