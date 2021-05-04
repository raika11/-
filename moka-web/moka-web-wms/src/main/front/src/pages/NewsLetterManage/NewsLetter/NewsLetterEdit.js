import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaCard } from '@/components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, getNewsLetter, clearNewsLetter, changeInvalidList, saveNewsLetter } from '@store/newsLetter';
import NewsLetterBasicInfo from './components/NewsLetterBasicInfo';
import NewsLetterSendInfo from './components/NewsLetterSendInfo';
import toast, { messageBox } from '@/utils/toastUtil';
import commonUtil from '@/utils/commonUtil';
import { invalidListToError } from '@/utils/convertUtil';
// import NewsLetterSetInfo from './components/NewsLetterSetInfo';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { letterSeq } = useParams();
    const storeLetter = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterInfo);
    const invalidList = useSelector(({ newsLetter }) => newsLetter.invalidList);
    const [temp, setTemp] = useState(initialState.newsLetter.letterInfo);
    const [error, setError] = useState({});
    const sendInfoRef = useRef(null);

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        (data) => {
            setTemp({ ...temp, ...data });
            Object.keys(data).forEach((key) => {
                if (error[key]) {
                    setError({ ...error, [key]: false });
                }
            });
        },
        [error, temp],
    );

    /**
     * 유효성 검사
     * @param {object} obj 저장 데이터
     */
    const validate = (obj) => {
        let isInvalid = false;
        let errList = [];

        // 발송 방법 체크
        if (commonUtil.isEmpty(obj.sendType)) {
            errList.push({
                field: 'sendType',
                reason: '발송 방법을 선택하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 유형 체크
        if (commonUtil.isEmpty(obj.letterType)) {
            errList.push({
                field: 'letterType',
                reason: '유형을 선택하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 카테고리 체크
        if (commonUtil.isEmpty(obj.category)) {
            errList.push({
                field: 'category',
                reason: '카테고리를 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 뉴스레터 명 체크
        if (commonUtil.isEmpty(obj.letterName)) {
            errList.push({
                field: 'letterName',
                reason: '뉴스레터 명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 뉴스레터 설명 체크
        if (commonUtil.isEmpty(obj.letterDesc)) {
            errList.push({
                field: 'letterDesc',
                reason: '뉴스레터 설명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 발송 방법이 자동일 때 체크할 목록
        if (obj.sendType === 'A') {
            // 채널 타입 체크
            if (commonUtil.isEmpty(obj.channelType)) {
                errList.push({
                    field: 'channelType',
                    reason: '채널 타입을 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 채널 아이디 체크
            if (commonUtil.isEmpty(obj.channelId) && (obj.channelType === 'ISSUE' || obj.channelType === 'JPOD' || obj.channelType === 'REPORTER')) {
                errList.push({
                    field: 'channelId',
                    reason: '이슈, J팟 채널, 기자 등 해당 채널 값을 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 채널 데이터 아이디 체크
            if (commonUtil.isEmpty(obj.channelDataId) && obj.channelType === 'ARTPKG') {
                errList.push({
                    field: 'channelDataId',
                    reason: '에피소드 또는 기사를 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 발송 조건 체크
            if (commonUtil.isEmpty(obj.sendOrder) || commonUtil.isEmpty(String(obj.sendMinCnt)) || commonUtil.isEmpty(String(obj.sendMaxCnt))) {
                errList.push({
                    field: 'sendCondition',
                    reason: '레이아웃에 맞는 발송 조건과 콘텐츠 조건을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 발송 주기 체크(자동)
            if (commonUtil.isEmpty(obj.sendPeriod)) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '발송할 주기를 선택하세요',
                });
                isInvalid = isInvalid || true;
            } else if (obj.sendPeriod === 'D' && commonUtil.isEmpty(obj.sendTime)) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '매일 발송될 시간을 입력하세요',
                });
                isInvalid = isInvalid || true;
            } else if ((obj.sendPeriod === 'W' || obj.sendPeriod === 'M') && (commonUtil.isEmpty(obj.sendDay) || commonUtil.isEmpty(obj.sendTime))) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '발송 요일(발송일)과 발송 시간을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 발송 제목 체크(자동)
            if (commonUtil.isEmpty(String(obj.dateTab))) {
                errList.push({
                    field: 'sendTitle',
                    reason: '발송 제목의 날짜 표기 방식을 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            if (commonUtil.isEmpty(String(obj.dateType)) || commonUtil.isEmpty(String(obj.dateType))) {
                errList.push({
                    field: 'sendTitle',
                    reason: '발송 제목의 날짜 표기 방식을 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
        }
        // 레이아웃 체크
        if (commonUtil.isEmpty(obj.containerSeq)) {
            errList.push({
                field: 'containerSeq',
                reason: '레이아웃을 선택하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 발송 방법이 수동일 때 체크할 목록
        if (obj.sendType === 'E') {
            // 발송 주기 체크(수동)
            if (obj.sendPeriod === 'D' && commonUtil.isEmpty(obj.sendTime)) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '매일 발송될 시간을 입력하세요',
                });
                isInvalid = isInvalid || true;
            } else if ((obj.sendPeriod === 'W' || obj.sendPeriod === 'M') && (commonUtil.isEmpty(obj.sendDay) || commonUtil.isEmpty(obj.sendTime))) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '발송 요일(발송일)과 발송 시간을 입력하세요',
                });
                isInvalid = isInvalid || true;
            } else if (obj.sendPeriod === '' && commonUtil.isEmpty(obj.sendTimeEdit)) {
                errList.push({
                    field: 'sendPeriodInfo',
                    reason: '발송 주기 직접 입력값을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 레터 편집 체크(수동)
            if (commonUtil.isEmpty(obj.editLetterType)) {
                errList.push({
                    field: 'letterEdit',
                    reason: '수동 상품의 레터 편집 타입을 선택하세요',
                });
                isInvalid = isInvalid || true;
            } else if (obj.editLetterType === 'L' && commonUtil.isEmpty(String(obj.formSeq))) {
                errList.push({
                    field: 'letterEdit',
                    reason: '편집폼을 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 발송 제목 체크(수동)
            if (commonUtil.isEmpty(obj.editTitle)) {
                errList.push({
                    field: 'letterEdit',
                    reason: '발송 제목을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
        }
        // 발송자 명 체크
        if (commonUtil.isEmpty(obj.senderName)) {
            errList.push({
                field: 'senderName',
                reason: '발송자 명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 발송자 이메일 체크
        if (commonUtil.isEmpty(obj.senderEmail)) {
            errList.push({
                field: 'senderEmail',
                reason: '발송자 이메일을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate(temp)) {
            dispatch(
                saveNewsLetter({
                    newsLetter: temp,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            console.log(error);
        }
    };

    /**
     * 임시저장
     */
    const handleClickTempSave = () => {
        let nt = { ...temp, status: 'P' };
        if (validate(nt)) {
            dispatch(
                saveNewsLetter({
                    newsLetter: nt,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            console.log(error);
        }
    };

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
        // 뉴스레터 상세 조회
        if (letterSeq) {
            dispatch(getNewsLetter(letterSeq));
        }
    }, [letterSeq, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearNewsLetter());
        };
    }, [dispatch]);

    useEffect(() => {
        // local temp 셋팅
        let st = moment(storeLetter.sendTime, DB_DATEFORMAT);
        if (!st.isValid()) st = null;
        let ssd = moment(storeLetter.sendStartDt, DB_DATEFORMAT);
        if (!ssd.isValid()) st = null;

        setTemp({ ...storeLetter, sendTime: st, sendStartDt: ssd });
        setError({});
    }, [storeLetter]);

    useEffect(() => {
        // 발송자 명이 바뀌면 발송자 정보 셋팅
        if (sendInfoRef.current) {
            if (sendInfoRef.current.sender.value === 'ja') {
                setTemp({ ...temp, senderName: '중앙일보', senderEmail: 'root@joongang.co.kr' });
            } else {
                setTemp({ ...temp, senderName: '', senderEmail: '' });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendInfoRef]);

    useEffect(() => {
        // 발송 방법이 바뀌면 상세 정보 초기화
        setTemp({ ...initialState.newsLetter.letterInfo, sendType: temp.sendType });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.sendType]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

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
                    onClick: handleClickTempSave,
                },
                {
                    text: letterSeq ? '수정' : '저장',
                    variant: 'positive',
                    disabled: !temp.containerSeq ? true : false,
                    className: 'mr-1',
                    onClick: handleClickSave,
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
                <NewsLetterBasicInfo letterSeq={letterSeq} temp={temp} onChangeValue={handleChangeValue} error={error} setError={setError} />
                {/* 뉴스레터 발송정보 */}
                <NewsLetterSendInfo ref={sendInfoRef} temp={temp} onChangeValue={handleChangeValue} error={error} setError={setError} />
                {/* 뉴스레터 설정 */}
                {/* <NewsLetterSetInfo temp={temp} setTemp={setTemp} onChangeValue={handleChangeValue} /> */}
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
