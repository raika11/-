import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaCard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { initialState, getNewsLetter, clearNewsLetter } from '@store/newsLetter';
import NewsLetterBasicInfo from './components/NewsLetterBasicInfo';
import NewsLetterSendInfo from './components/NewsLetterSendInfo';
import NewsLetterSetInfo from './components/NewsLetterSetInfo';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { letterSeq } = useParams();

    const storeLetter = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterInfo);
    // const [temp, setTemp] = useState({
    //     state: 'T',
    //     sendType: 'A',
    //     type: '',
    //     contents: '',
    //     pkg: '',
    //     service: '',
    //     reporter: '',
    //     jpod: '',
    //     sendPeriod: 'S',
    //     sendPeriodType: 'week',
    //     week: [],
    //     day: 1,
    //     sendDt: null,
    //     sendTime: null,
    //     item: '',
    //     imgUrl: '',
    //     thumbnailFile: null,
    //     editLetterType: 'L',
    // });
    const [temp, setTemp] = useState(initialState.newsLetter.letterInfo);

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        (data) => {
            setTemp({ ...temp, ...data });
        },
        [temp],
    );

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(match.path);
    };

    useEffect(() => {
        const nd = new Date();
        setTemp({ ...temp, sendDt: moment(nd).format(DATE_FORMAT), sendTime: moment(nd).startOf('day').format('HH:mm') });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTemp(storeLetter);
    }, [storeLetter]);

    useEffect(() => {
        if (letterSeq) {
            dispatch(getNewsLetter(letterSeq));
        } else {
            dispatch(clearNewsLetter());
        }
    }, [letterSeq, dispatch]);

    return (
        <MokaCard
            className="w-100"
            title={`뉴스레터 상품 ${letterSeq ? '수정' : '등록'}`}
            footer
            footerButtons={[
                letterSeq && {
                    text: '미리보기',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                {
                    text: '임시저장',
                    variant: 'temp',
                    className: 'mr-1',
                },
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleClickCancel,
                },
            ].filter(Boolean)}
        >
            <Form>
                {/* 뉴스레터 기본정보 */}
                <NewsLetterBasicInfo letterSeq={letterSeq} temp={temp} setTemp={setTemp} onChangeValue={handleChangeValue} />
                {/* 뉴스레터 발송정보 */}
                <NewsLetterSendInfo temp={temp} setTemp={setTemp} onChangeValue={handleChangeValue} />
                {/* 뉴스레터 설정 */}
                <NewsLetterSetInfo temp={temp} setTemp={setTemp} onChangeValue={handleChangeValue} />
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
