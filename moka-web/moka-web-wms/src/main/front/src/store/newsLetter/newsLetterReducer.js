import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './newsLetterAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    newsLetter: {
        error: null,
        search: {
            sort: 'letterSeq,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            letterType: '',
            status: '',
            sendType: '',
            abTestYn: '',
            startDt: null,
            endDt: null,
            letterTitle: '',
        },
        letterInfo: {
            letterSeq: '',
            sendType: 'A',
            letterType: 'O',
            status: 'P',
            channelType: 'ISSUE',
            channelId: '',
            channelDataId: '',
            sendPeriod: 'S',
            sendPeriodType: 'W', //임시 데이터(테이블에 없음)
            sendDay: '',
            sendTime: null,
            sendBaseCnt: '',
            senderName: '중앙일보',
            senderEmail: 'root@joongang.co.kr',
            sendStartDt: null,
            scbLinkYn: '',
            containerSeq: 0,
            formSeq: null,
            headerImg: '',
            editLetterType: '',
            abtestYN: '',
            memo: '',
            regDt: '',
            regId: '',
            modDt: '',
            modId: '',
            category: '',
            letterTitle: '',
            titleType: '',
            letterName: '',
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
            abtestYN: 'Y',
            abItem: '', // 임시 데이터(테이블에 없음)
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
        // 검색조건 변경
        [act.CHANGE_NEWS_LETTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.newsLetter.search = payload;
            });
        },
    },
    initialState,
);
