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
            letterType: '',
            status: '',
            channelType: 'ISSUE',
            channelId: '',
            channelDataId: '',
            sendPeriod: 'S',
            sendPeriodType: 'W', //임시 데이터(테이블에 없음)
            sendDay: '',
            sendTime: null,
            sendBaseCnt: '',
            senderName: '',
            senderEmail: '',
            sendStartDt: null,
            scbLinkYn: '',
            containerSeq: null,
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
