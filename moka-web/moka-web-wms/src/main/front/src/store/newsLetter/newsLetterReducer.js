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
            // category: '',
            status: '',
            sendType: '',
            startDt: null,
            endDt: null,
            abtestYn: '',
            letterName: '',
        },
        // 모달 검색 조건
        modalSearch: {
            jpodSearch: {
                chnlNm: '',
            },
        },
        letterInfo: {
            letterSeq: '',
            sendType: 'A',
            letterType: 'O',
            status: 'P',
            channelType: 'ISSUE',
            channelId: '',
            channelDataId: '',
            sendPeriod: 'D',
            sendDay: '',
            sendTime: null,
            sendMinCnt: '',
            sendMaxCnt: '',
            sendOrder: 'N',
            scbYn: '',
            scbLinkYn: '',
            senderName: '',
            senderEmail: '',
            sendStartDt: null,
            containerSeq: null,
            formSeq: null,
            headerImg: '',
            editLetterType: '',
            abtestYn: '',
            memo: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            lastSendDt: '',
            category: '',
            titleType: 'A',
            letterTitle: '',
            letterName: '',
            letterEngName: '',
            letterImg: '',
            letterDesc: '',
        },
    },
    send: {
        error: null,
        search: {
            sort: 'letterSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            startDt: null,
            endDt: null,
            letterTitle: '',
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
            });
        },
        // 검색조건 변경
        [act.CHANGE_NEWS_LETTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.newsLetter.search = payload;
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
    },
    initialState,
);
