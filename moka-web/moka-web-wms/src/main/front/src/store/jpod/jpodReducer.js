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
        podty: {
            total: 0,
            list: [],
        },
        selectReporter: null,
        selectPodty: [],
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
};

export default handleActions(
    {
        // 전체 초기화.
        [CLEAR_STORE]: () => initialState,
        [GET_REPORTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.reporter.list = body.list;
                draft.channel.reporter.total = body.totalCnt;
            });
        },
        // 진행자 검색 모달.
        [CLEAR_REPORTER]: (state) => {
            return produce(state, (draft) => {
                draft.channel.reporter = initialState.channel.reporter;
                draft.channel.selectReporter = initialState.channel.selectReporter;
            });
        },
        [CHANGE_REPORTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.reporter.search = payload;
            });
        },
        [SELECT_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.selectReporter = payload;
            });
        },
        // 팟티 검색 모달.
        [CLEAR_CHANNEL_PODTY]: (state) => {
            return produce(state, (draft) => {
                draft.channel.podty = initialState.channel.podty;
            });
        },
        [GET_CHANNEL_PODTY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.podty.list = body.list;
                draft.channel.podty.total = body.totalCnt;
            });
        },
        [SELECT_CHANNEL_PODTY]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.selectPodty = payload;
            });
        },

        [CHANGE_JPOD_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.search = payload;
            });
        },
        [GET_CHANNELS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.jpod.list = body.list;
                draft.channel.jpod.total = body.totalCnt;
            });
        },
        [GET_CHANNEL_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = body;
            });
        },
        [CLEAR_CHANNEL_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.channel.channelInfo = initialState.channel.channelInfo;
            });
        },
    },
    initialState,
);
