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
} from './jpodAction';

export const initialState = {
    channel: {
        list: {
            total: 0,
            list: [],
            search: {
                page: 0,
                sort: 'channelId,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                startDt: moment().format('YYYY-MM-DD 00:00:00'),
                endDt: moment().format('YYYY-MM-DD 23:59:00'),
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
        selectReporter: [],
        selectPodty: [],
        channelInfo: {
            usedYn: 'Y', // 사용유무
            chnlNm: '', // 채널명
            chnlMemo: '', // 채널소개
            chnlSdt: moment().format('YYYY-MM-DD'), // 채널 개설일
            chnlImg: '', // 커버 이미지.
            chnlThumb: '', // 썸네일 이미지
            podtyUrl: '', // 파치채널
            chnlEdt: moment().format('YYYY-MM-DD'), // 채널 종료일
            chnlDy: 0, // 채널 방송 요일.
            chnlImgMob: '', // 모바일용 이미지
            podtyChnlSrl: 0, // 파치태널SRL
            chnlImgFile: '', // 이미지
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
            });
        },
        [CHANGE_REPORTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.reporter.search = payload;
            });
        },
        [SELECT_REPORTER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel.selectReporter = [...state.channel.selectReporter, payload];
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
    },
    initialState,
);
