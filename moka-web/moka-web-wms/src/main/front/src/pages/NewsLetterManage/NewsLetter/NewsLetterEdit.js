import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaCard } from '@/components';
import { DATE_FORMAT, DB_DATEFORMAT } from '@/constants';
import { initialState, getNewsLetter, clearNewsLetter } from '@store/newsLetter';
import NewsLetterBasicInfo from './components/NewsLetterBasicInfo';
import NewsLetterSendInfo from './components/NewsLetterSendInfo';
import { messageBox } from '@/utils/toastUtil';
// import NewsLetterSetInfo from './components/NewsLetterSetInfo';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { letterSeq } = useParams();

    const storeLetter = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterInfo);
    const [temp, setTemp] = useState(initialState.newsLetter.letterInfo);
    const sendInfoRef = useRef(null);

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
        messageBox.confirm(
            '뉴스레터 상품 등록을 취소 하시겠습니까?',
            () => {
                history.push(match.path);
            },
            () => {},
        );
    };

    useEffect(() => {
        let st = moment(storeLetter.sendTime, DB_DATEFORMAT);
        if (!st.isValid()) st = null;
        let ssd = moment(storeLetter.sendStartDt, DB_DATEFORMAT);
        if (!ssd.isValid()) st = null;

        if (sendInfoRef.current) {
            if (sendInfoRef.current.sender.value === 'ja') {
                setTemp({ ...storeLetter, senderName: '중앙일보', senderEmail: 'root@joongang.co.kr', sendTime: st, sendStartDt: ssd });
            } else {
                setTemp({ ...storeLetter, senderName: '', senderEmail: '', sendTime: st, sendStartDt: ssd });
            }
        }
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
                    disabled: !temp.containerSeq ? true : false,
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
                <NewsLetterBasicInfo letterSeq={letterSeq} temp={temp} onChangeValue={handleChangeValue} />
                {/* 뉴스레터 발송정보 */}
                <NewsLetterSendInfo ref={sendInfoRef} temp={temp} onChangeValue={handleChangeValue} />
                {/* 뉴스레터 설정 */}
                {/* <NewsLetterSetInfo temp={temp} setTemp={setTemp} onChangeValue={handleChangeValue} /> */}
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
