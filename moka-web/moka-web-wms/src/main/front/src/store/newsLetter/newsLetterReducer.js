import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './newsLetterAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    newsLetter: {
        list: [],
        total: 0,
        error: null,
        search: {
            sort: 'letterSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            useTotal: '',
            letterType: '',
            category: '',
            status: '',
            sendType: '',
            startDt: null,
            endDt: null,
            scbYn: '',
            abtestYn: '',
            letterName: '',
        },
        // 모달 검색 조건
        modalSearch: {
            jpodSearch: {
                chnlNm: '',
            },
        },
        letterChannelTypeList: [],
        letterInfo: {
            letterSeq: '',
            sendType: 'A',
            letterType: 'O',
            status: 'P',
            channelType: '',
            channelId: '',
            channelDataId: '',
            sendPeriod: 'D',
            sendDay: '',
            sendTime: null,
            sendTimeEdit: '',
            sendMinCnt: 1,
            sendMaxCnt: 1,
            sendOrder: 'N',
            scbYn: 'N',
            scbLinkYn: 'Y',
            senderName: '',
            senderEmail: '',
            sendStartDt: null,
            containerSeq: null,
            formSeq: null,
            headerImg: '',
            editLetterType: 'F',
            abtestYn: '',
            memo: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            lastSendDt: '',
            category: '',
            titleType: '',
            dateTab: 6,
            dateType: 1,
            artTitleYn: 'N',
            editTitle: '',
            letterTitle: '',
            letterName: '',
            letterEngName: '',
            letterImg: '',
            letterDesc: '',
        },
    },
    send: {
        list: [],
        letterList: [],
        letterListError: null,
        total: 0,
        error: null,
        search: {
            sort: 'sendSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            letterType: '',
            startDt: null,
            endDt: null,
            letterName: '',
        },
        sendInfo: {
            sendSeq: '',
            letterSeq: '',
            abtestYn: 'Y',
            abVariantType: '',
            abDiv: '',
            sendStatus: '',
            senderName: '',
            senderEmail: '',
            viewYn: '',
            reserveYn: '',
            sendDt: null,
            sendTime: null,
            scbLinkYn: '',
            containerSeq: 0,
            headerImg: '',
            regDt: null,
            regId: '',
            partSeq: '',
            letterTitle: '',
            uploadEmail: '',
            letterBody: '',
        },
    },
    invalidList: [],
};

/**
 * reducer
 */
export default handleActions(
    {
        // 스토어 초기화
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_NEWS_LETTER]: (state) => {
            return produce(state, (draft) => {
                draft.newsLetter.letterInfo = initialState.newsLetter.letterInfo;
                draft.invalidList = initialState.invalidList;
            });
        },
        // 데이터 변경
        [act.CHANGE_NEWS_LETTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.newsLetter.search = payload;
            });
        },
        [act.CHANGE_NEWS_LETTER_SEND_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.send.search = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        // 뉴스레터 상품 목록 조회
        [act.GET_NEWS_LETTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.newsLetter.total = body.totalCnt;
                draft.newsLetter.list = body.list;
                draft.newsLetter.error = initialState.error;
            });
        },
        [act.GET_NEWS_LETTER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.newsLetter.total = initialState.newsLetter.total;
                draft.newsLetter.list = initialState.newsLetter.list;
                draft.newsLetter.error = payload;
            });
        },
        // 뉴스레터 상품 상세 조회
        [act.GET_NEWS_LETTER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.newsLetter.letterInfo = body;
            });
        },
        [act.GET_NEWS_LETTER_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.newsLetter.letterInfo = initialState.newsLetter.letterInfo;
            });
        },
        // 뉴스레터 채널별 등록된 컨텐츠 조회
        [act.GET_NEWS_LETTER_CHANNEL_TYPE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.newsLetter.letterChannelTypeList = body;
            });
        },
        [act.GET_NEWS_LETTER_CHANNEL_TYPE_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.newsLetter.letterChannelTypeList = initialState.newsLetter.letterChannelTypeList;
            });
        },
        // 뉴스레터 발송 목록 조회
        [act.GET_NEWS_LETTER_SEND_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.send.total = body.totalCnt;
                draft.send.list = body.list;
                draft.send.error = initialState.error;
            });
        },
        [act.GET_NEWS_LETTER_SEND_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.send.total = initialState.send.total;
                draft.send.list = initialState.send.list;
                draft.send.error = payload;
            });
        },
        // 뉴스레터 수동 상품 목록 조회(sendType: E, STATUS: Y)
        [act.GET_NEWS_LETTER_PASSIVE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.send.letterList = body.list.map((l) => ({ value: l.letterName, lebel: l.letterName }));
                draft.send.letterListError = initialState.letterListError;
            });
        },
        [act.GET_NEWS_LETTER_PASSIVE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.send.letterList = initialState.send.letterList;
                draft.send.letterListError = payload;
            });
        },
    },
    initialState,
);
