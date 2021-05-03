import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import toast from '@/utils/toastUtil';
import NewsLetterLayoutModal from '../modals/NewsLetterLayoutModal';
import { EditThumbModal } from '@/pages/Desking/modals';
import { DB_DATEFORMAT, DATE_FORMAT, TIME_FORMAT } from '@/constants';
import NewsLetterEditFormModal from '../modals/NewsLetterEditFormModal';

/**
 * 뉴스레터 편집 > 발송정보 설정
 */
const NewsLetterSendInfo = forwardRef(({ temp, onChangeValue }, ref) => {
    // 발송 주기(일/주/월) state
    const [sendTime, setSendTime] = useState({
        D: moment(new Date(), DB_DATEFORMAT).startOf('day'),
        W: moment(new Date(), DB_DATEFORMAT).startOf('day'),
        M: moment(new Date(), DB_DATEFORMAT).startOf('day'),
    });
    const [sendDay, setSendDay] = useState('1');
    const [weekArr, setWeekArr] = useState([]);
    // 발송자 명 state
    const [sn, setSn] = useState('ja');
    // 발송 시작일 state
    const [sendStartDt, setSendStartDt] = useState({
        date: null,
        time: moment(new Date(), DB_DATEFORMAT).startOf('day'),
    });
    // 발송 제목 날짜 표기 state
    const [dateType, setDateType] = useState({
        M: 1, // 날짜 표기 월 dateType 1이면 발송,해당없음 0이면 직전 또는 TODAY
        WK: 1, // 주(한글)
        WE: 1, // 주(영문)
        D: 1, // 일
        WD: 1, // 요일
    });
    // 발송 제목 형식
    const [sendTitleType, setSendTitleType] = useState('');
    const [layoutModal, setLayoutModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);
    const [editFormModal, setEditFormModal] = useState(false);
    // 발송자 명 ref
    const senderInfoRef = useRef(null);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'sn') {
            setSn(value);
            if (value === 'ja') {
                onChangeValue({ senderName: '중앙일보', senderEmail: 'root@joongang.co.kr' });
            } else {
                onChangeValue({ senderName: '', senderEmail: '' });
            }
        } else if (name.indexOf('newDateType') > -1) {
            onChangeValue({ dateType: Number(value) });
        } else if (name === sendDay) {
            setSendDay(value);
            onChangeValue({ [name]: value });
        } else if (name === 'artTitleYn') {
            if (checked) {
                onChangeValue({ editTitle: '', [name]: 'Y' });
            } else {
                onChangeValue({ [name]: 'N' });
            }
        } else if (name === 'editLetterType') {
            if (value === 'F') {
                onChangeValue({ [name]: value, formSeq: null });
            } else {
                onChangeValue({ [name]: value });
            }
        } else {
            onChangeValue({ [name]: value });
        }
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        if (data) {
            onChangeValue({ headerImgFile: data });
        } else {
            onChangeValue({ headerImg: null, headerImgFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChangeValue({ headerImg: imageSrc, headerImgFile: file });
    };

    /**
     * 수동 상품 편집폼 등록
     * @param {object} form 폼 데이터
     */
    const addFormSeq = (form) => {
        onChangeValue({ formSeq: form.formSeq });
    };

    useImperativeHandle(
        ref,
        () => ({
            sender: senderInfoRef.current,
        }),
        [],
    );

    useEffect(() => {
        if (sendStartDt.date && sendStartDt.time) {
            let nd = `${moment(sendStartDt.date).format(DATE_FORMAT)} ${moment(sendStartDt.time).format(TIME_FORMAT)}`;
            onChangeValue({ sendStartDt: nd });
        } else {
            onChangeValue({ sendStartDt: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendStartDt]);

    useEffect(() => {
        // 신규 콘텐트 수 범위가 2건 이상인 경우 발송제목 > 직접입력 비활성
        if (Number(temp.sendMaxCnt) - Number(temp.sendMinCnt) > 1) {
            onChangeValue({ editTitle: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.sendMaxCnt, temp.sendMinCnt]);

    useEffect(() => {
        // 발송 제목 형식 확인
        let fix, date, title;
        // 고정 요소
        if (temp.titleType === 'N') {
            fix = '[뉴스레터 상품명]';
        } else if (temp.titleType === 'J') {
            fix = '[중앙일보]';
        } else if (temp.titleType === 'A') {
            fix = '[광고]';
        } else {
            fix = '';
        }

        if (Number(temp.dateTab) === 1) {
            date = '○○월';
        } else if (Number(temp.dateTab) === 2) {
            date = '○○월 ○○주';
        } else if (Number(temp.dateTab) === 3) {
            date = 'MM/DD ~ MM/DD';
        } else if (Number(temp.dateTab) === 4) {
            date = '○○월 ○○일';
        } else if (Number(temp.dateTab) === 5) {
            date = '○요일';
        } else {
            date = '';
        }

        if (temp.editTitle) {
            title = temp.editTitle;
        } else if (temp.artTitleYn === 'Y') {
            title = '[기사 제목]';
        } else {
            title = '';
        }

        setSendTitleType(`${fix}   ${date}   ${title}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.titleType, temp.dateTab, temp.editTitle]);

    return (
        <>
            {/* 뉴스레터 발송정보 */}
            <p className="mb-2">※ 발송정보 설정</p>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="레이아웃 선택" required />
                <div>
                    <MokaSearchInput
                        name="containerSeq"
                        placeholder="레이아웃을 검색해 주세요"
                        value={temp.containerSeq}
                        onChange={handleChangeValue}
                        onSearch={() => setLayoutModal(true)}
                        inputProps={{ readOnly: true }}
                        required
                    />
                    <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시저장 상태 값으로 지정됩니다.</p>
                </div>
                <NewsLetterLayoutModal show={layoutModal} onHide={() => setLayoutModal(false)} />
            </Form.Row>
            {temp.sendType === 'A' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 조건" required />
                    <Col xs={5} className="p-0 d-flex align-items-center">
                        <MokaInput
                            as="radio"
                            name="sendOrder"
                            value="N"
                            id="letter-sendOrder-n"
                            inputProps={{ label: '최신 등록순', custom: true, checked: temp.sendOrder === 'N' }}
                            onChange={handleChangeValue}
                            disabled={temp.channelType === 'TREND' ? true : false}
                        />
                        <MokaInput
                            as="radio"
                            name="sendOrder"
                            value="H"
                            id="letter-sendOrder-h"
                            inputProps={{ label: '조회 높은순', custom: true, checked: temp.sendOrder === 'H' }}
                            onChange={handleChangeValue}
                            disabled={temp.channelType === 'TREND' ? true : false}
                        />
                    </Col>
                    <p className="mb-0 mr-2">신규 콘텐츠</p>
                    <Col xs={3} className="p-0 d-flex align-items-center">
                        <MokaInput name="sendMinCnt" value={temp.sendMinCnt} onChange={handleChangeValue} disabled={temp.channelType === 'TREND' ? true : false} />
                        <p className="mb-0 mx-2">~</p>
                        <MokaInput name="sendMaxCnt" value={temp.sendMaxCnt} onChange={handleChangeValue} disabled={temp.channelType === 'TREND' ? true : false} />
                    </Col>
                </Form.Row>
            )}
            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="발송 주기" required />
                <div className="flex-fill">
                    {/* 매일 */}
                    <div className="mb-2 d-flex align-items-center">
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                value="D"
                                name="sendPeriod"
                                id="letter-sendPeriod-d"
                                inputProps={{ label: '1일', custom: true, checked: temp.sendPeriod === 'D' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <div style={{ width: 120 }}>
                            <MokaInput
                                as="dateTimePicker"
                                value={sendTime.D}
                                inputProps={{ dateFormat: null }}
                                disabled={temp.sendPeriod !== 'D'}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSendTime({ ...sendTime, D: date });
                                        onChangeValue({ sendTime: date });
                                    } else {
                                        setSendTime({ ...sendTime, D: null });
                                        onChangeValue({ sendTime: null });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* 매 주 */}
                    <div className="mb-2 d-flex align-items-center">
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                value="W"
                                name="sendPeriod"
                                id="letter-sendPeriod-w"
                                inputProps={{ label: '매 주', custom: true, checked: temp.sendPeriod === 'W' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <ToggleButtonGroup
                            type="checkbox"
                            size="sm"
                            className="mr-2"
                            value={weekArr}
                            onChange={(value) => {
                                setWeekArr(value);
                                if (weekArr.length > 0) {
                                    let sd = value.join('');
                                    onChangeValue({ sendDay: sd });
                                } else {
                                    onChangeValue({ sendDay: '' });
                                }
                            }}
                        >
                            <ToggleButton variant="outline-table-btn" value="1" disabled={temp.sendPeriod !== 'W'}>
                                월
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="2" disabled={temp.sendPeriod !== 'W'}>
                                화
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="3" disabled={temp.sendPeriod !== 'W'}>
                                수
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="4" disabled={temp.sendPeriod !== 'W'}>
                                목
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="5" disabled={temp.sendPeriod !== 'W'}>
                                금
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="6" disabled={temp.sendPeriod !== 'W'}>
                                토
                            </ToggleButton>
                            <ToggleButton variant="outline-table-btn" value="0" disabled={temp.sendPeriod !== 'W'}>
                                일
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{ width: 120 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="right"
                                value={sendTime.W}
                                inputProps={{ dateFormat: null }}
                                disabled={temp.sendPeriod !== 'W'}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSendTime({ ...sendTime, W: date });
                                        onChangeValue({ sendTime: date });
                                    } else {
                                        setSendTime({ ...sendTime, W: null });
                                        onChangeValue({ sendTime: null });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* 매 월 */}
                    <div className="mb-2 d-flex align-items-center">
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                value="M"
                                className="mr-2"
                                name="sendPeriod"
                                id="letter-sendPeriod-m"
                                inputProps={{ label: '매 월', custom: true, checked: temp.sendPeriod === 'M' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" name="sendDay" value={sendDay} onChange={handleChangeValue} disabled={temp.sendPeriod !== 'M'}>
                                {[...Array(30)].map((d, idx) => {
                                    return (
                                        <option key={idx} value={idx + 1}>
                                            {idx + 1}
                                        </option>
                                    );
                                })}
                            </MokaInput>
                        </Col>
                        <p className="mb-0 mr-2">일</p>
                        <div className="mr-2" style={{ width: 120 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="right"
                                value={sendTime.M}
                                inputProps={{ dateFormat: null }}
                                disabled={temp.sendPeriod !== 'M'}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSendTime({ ...sendTime, M: date });
                                        onChangeValue({ sendTime: date });
                                    } else {
                                        setSendTime({ ...sendTime, M: null });
                                        onChangeValue({ sendTime: null });
                                    }
                                }}
                            />
                        </div>
                        {temp.sendType === 'A' && (
                            <MokaInput
                                as="radio"
                                value="C"
                                name="sendPeriod"
                                id="letter-sendPeriod-c"
                                inputProps={{ label: '발송 조건 만족 시', custom: true, checked: temp.sendPeriod === 'C' }}
                                onChange={handleChangeValue}
                            />
                        )}
                    </div>
                    {temp.sendType === 'E' && (
                        <div className="d-flex align-items-center">
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="sendPeriod"
                                    value="D"
                                    id="letter-sendPeriod-r"
                                    inputProps={{ label: '직접 입력', custom: true, checked: temp.sendPeriod === 'R' }}
                                    disabled
                                />
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaInput className="flex-fill" disabled />
                            </Col>
                        </div>
                    )}
                </div>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <div className="flex-fill">
                    <MokaInputLabel
                        as="imageFile"
                        inputClassName="w-100"
                        label={
                            <div className="pt-3">
                                상단 이미지 선택
                                <br />
                                <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                    신규등록
                                </Button>
                            </div>
                        }
                        inputProps={{ img: temp.headerImg, setFileValue: handleFileValue, height: 80, deleteButton: true, accept: 'image/jpeg, image/png' }}
                    />
                    <div className="d-flex align-items-center">
                        <MokaInputLabel as="none" label=" " />
                        <p className="mb-0 color-primary">※ 등록된 이미지가 없을 경우 레이아웃의 이미지가 적용됩니다.</p>
                    </div>
                </div>
            </Form.Row>
            {temp.sendType === 'E' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="레터 편집" required />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="radio"
                            name="editLetterType"
                            value="F"
                            id="letter-editLetterType-f"
                            inputProps={{ label: '직접 작성', custom: true, checked: temp.editLetterType === 'F' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="radio"
                            name="editLetterType"
                            value="L"
                            id="letter-editLetterType-l"
                            inputProps={{ label: '전용폼', custom: true, checked: temp.editLetterType === 'L' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <MokaSearchInput
                        placeholder="편집 폼을 검색해 주세요"
                        className="flex-fill"
                        name="formSeq"
                        value={temp.formSeq}
                        onChange={handleChangeValue}
                        onSearch={() => setEditFormModal(true)}
                        inputProps={{ readOnly: true }}
                        disabled={temp.editLetterType !== 'L' ? true : false}
                    />
                    <NewsLetterEditFormModal show={editFormModal} onHide={() => setEditFormModal(false)} onRowClicked={addFormSeq} />
                </Form.Row>
            )}
            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="발송자 명" required />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput ref={senderInfoRef} as="select" name="sn" value={sn} onChange={handleChangeValue}>
                        <option value="ja">중앙일보</option>
                        <option value="">직접 입력</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput name="senderName" value={temp.senderName} onChange={handleChangeValue} inputProps={{ readOnly: sn === 'ja' ? true : false }} required />
                </Col>
                <MokaInput name="senderEmail" value={temp.senderEmail} onChange={handleChangeValue} inputProps={{ readOnly: sn === 'ja' ? true : false }} required />
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                {temp.sendType === 'A' && (
                    <>
                        <MokaInputLabel as="none" label="발송 시작일" required />
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                value={sendStartDt.date}
                                inputProps={{ timeFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        const nd = new Date();
                                        const diff = moment(nd).diff(date, 'days');
                                        if (diff > 0) {
                                            toast.warning('미래 일시를 지정해주세요');
                                            setSendStartDt({ ...sendStartDt, date: moment(nd, DB_DATEFORMAT) });
                                        } else {
                                            setSendStartDt({ ...sendStartDt, date: date });
                                        }
                                    } else {
                                        setSendStartDt({ ...sendStartDt, date: null });
                                    }
                                }}
                            />
                        </Col>
                        <div style={{ width: 120 }}>
                            <MokaInput
                                as="dateTimePicker"
                                value={sendStartDt.time}
                                inputProps={{ dateFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        const nd = new Date();
                                        if (moment(sendStartDt.date).format(DATE_FORMAT) === moment(nd).format(DATE_FORMAT)) {
                                            const diff = moment(nd).diff(date, 'minutes');
                                            if (diff > 0) {
                                                toast.warning('미래 일시를 지정해주세요');
                                                setSendStartDt({ ...sendStartDt, time: moment(nd, DB_DATEFORMAT) });
                                            }
                                        } else {
                                            setSendStartDt({ ...sendStartDt, time: date });
                                        }
                                    } else {
                                        setSendStartDt({ ...sendStartDt, time: null });
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
                {temp.sendType === 'E' && <MokaInputLabel className="flex-fill" name="editTitle" label="발송 제목" value={temp.editTitle} onChange={handleChangeValue} required />}
            </Form.Row>

            {temp.sendType === 'E' && (
                <Form.Row>
                    <MokaInputLabel as="none" label="받는이" />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center" style={{ height: 31 }}>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="scbLinkYn"
                                    value="Y"
                                    id="letter-scbLinkYn-y"
                                    inputProps={{ label: '구독자 연동', custom: true, checked: temp.scbLinkYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="scbLinkYn"
                                    value="N"
                                    id="letter-scbLinkYn-n"
                                    inputProps={{ label: '직접 등록', custom: true, checked: temp.scbLinkYn === 'N' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Button variant="positive" size="sm" style={{ overflow: 'visible' }}>
                                Excel 업로드
                            </Button>
                        </div>
                        <p className="mb-0 color-primary">※ 직접 등록 시 Excel 업로드는 필수입니다.</p>
                    </div>
                </Form.Row>
            )}

            {temp.sendType === 'A' && (
                <Form.Row className="align-items-center">
                    <MokaInputLabel as="none" label="발송 제목" required />
                    <div className="flex-fill">
                        <p className="mb-0">1) 고정 표기</p>
                        <Col xs={10} className="p-0 pl-3 mb-2 d-flex" style={{ height: 31 }}>
                            <MokaInput
                                as="radio"
                                name="titleType"
                                className="mr-2"
                                value="N"
                                id="letter-titleType-n"
                                inputProps={{ label: '[뉴스레터 상품명]', custom: true, checked: temp.titleType === 'N' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                name="titleType"
                                className="mr-2"
                                value="J"
                                id="letter-titleType-j"
                                inputProps={{ label: '[중앙일보]', custom: true, checked: temp.titleType === 'J' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                name="titleType"
                                className="mr-2"
                                value="A"
                                id="letter-titleType-a"
                                inputProps={{ label: '[광고]', custom: true, checked: temp.titleType === 'A' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                name="titleType"
                                value=""
                                id="letter-titleType-empty"
                                inputProps={{ label: '해당 없음', custom: true, checked: temp.titleType === '' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <p className="mb-0">2) 날짜 표기</p>
                        <Col xs={10} className="p-0 pl-3 mb-2">
                            {/* 월 */}
                            <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="dateTab"
                                        value="1"
                                        id="letter-dateTab-first"
                                        inputProps={{ label: '월(month)-○○월:', custom: true, checked: String(temp.dateTab) === '1' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType1"
                                        value="1"
                                        id="letter-dateType-first-f"
                                        inputProps={{ label: '발송월', custom: true, checked: String(dateType.M) === '1' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, M: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 1 ? true : false}
                                    />
                                </div>
                                <div>
                                    <MokaInput
                                        as="radio"
                                        name="newDateType1"
                                        value="0"
                                        id="letter-dateType-first-z"
                                        inputProps={{ label: '발송 직전월', custom: true, checked: String(dateType.M) === '0' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, M: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 1 ? true : false}
                                    />
                                </div>
                            </div>
                            {/* 주(00월 00주) */}
                            <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="dateTab"
                                        value="2"
                                        id="letter-dateTab-second"
                                        inputProps={{ label: '주(week)-○○월 ○○주:', custom: true, checked: String(temp.dateTab) === '2' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType2"
                                        value="1"
                                        id="letter-dateType-second-f"
                                        inputProps={{ label: '발송주', custom: true, checked: String(dateType.WK) === '1' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WK: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 2 ? true : false}
                                    />
                                </div>
                                <div>
                                    <MokaInput
                                        as="radio"
                                        name="newDateType2"
                                        value="0"
                                        id="letter-dateType-second-z"
                                        inputProps={{ label: '발송 직전주', custom: true, checked: String(dateType.WK) === '0' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WK: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 2 ? true : false}
                                    />
                                </div>
                            </div>
                            {/* 주(mm/dd) */}
                            <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="dateTab"
                                        value="3"
                                        id="letter-dateTab-third"
                                        inputProps={{ label: '주(week)-MM/DD ~ MM/DD:', custom: true, checked: String(temp.dateTab) === '3' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType3"
                                        value="1"
                                        id="letter-dateType-third-f"
                                        inputProps={{ label: '발송주', custom: true, checked: String(dateType.WE) === '1' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WE: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 3 ? true : false}
                                    />
                                </div>
                                <div>
                                    <MokaInput
                                        as="radio"
                                        name="newDateType3"
                                        value="0"
                                        id="letter-dateType-third-z"
                                        inputProps={{ label: '발송 직전주', custom: true, checked: String(dateType.WE) === '0' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WE: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 3 ? true : false}
                                    />
                                </div>
                            </div>
                            {/* 일 */}
                            <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="dateTab"
                                        value="4"
                                        id="letter-dateTab-fourth"
                                        inputProps={{ label: '일(day)-○○월 ○○일:', custom: true, checked: String(temp.dateTab) === '4' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType4"
                                        value="1"
                                        id="letter-dateType-fourth-f"
                                        inputProps={{ label: '발송일', custom: true, checked: String(dateType.D) === '1' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, D: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 4 ? true : false}
                                    />
                                </div>
                                <div>
                                    <MokaInput
                                        as="radio"
                                        name="newDateType4"
                                        value="0"
                                        id="letter-dateType-fourth-z"
                                        inputProps={{ label: '발송 직전일', custom: true, checked: String(dateType.D) === '0' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, D: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 4 ? true : false}
                                    />
                                </div>
                            </div>
                            {/* 요일 */}
                            <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="dateTab"
                                        value="5"
                                        id="letter-dateTab-fifth"
                                        inputProps={{ label: '요일:', custom: true, checked: String(temp.dateTab) === '5' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType5"
                                        value="1"
                                        id="letter-dateType-fifth-f"
                                        inputProps={{ label: '발송일(○요일)', custom: true, checked: String(dateType.WD) === '1' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WD: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 5 ? true : false}
                                    />
                                </div>
                                <div className="mr-2">
                                    <MokaInput
                                        as="radio"
                                        name="newDateType5"
                                        value="0"
                                        id="letter-dateType-fifth-z"
                                        inputProps={{ label: `Today's`, custom: true, checked: String(dateType.WD) === '0' }}
                                        onChange={(e) => {
                                            setDateType({ ...dateType, WD: Number(e.target.value) });
                                            handleChangeValue(e);
                                        }}
                                        disabled={Number(temp.dateTab) !== 5 ? true : false}
                                    />
                                </div>
                            </div>
                            <MokaInput
                                as="radio"
                                name="dateTab"
                                value="6"
                                id="letter-dateTab-sixth"
                                inputProps={{ label: '해당 없음', custom: true, checked: String(temp.dateTab) === '6' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <p className="mb-0">3) 직접 입력</p>
                        <Col xs={10} className="p-0 pl-3 d-flex align-items-center">
                            <div className="flex-fill mr-2">
                                <MokaInput
                                    name="editTitle"
                                    value={temp.editTitle}
                                    onChange={(e) => {
                                        handleChangeValue(e);
                                    }}
                                    disabled={temp.artTitleYn === 'Y' || Number(temp.sendMaxCnt) - Number(temp.sendMinCnt) > 1 ? true : false}
                                />
                            </div>
                            <div>
                                <MokaInput
                                    as="checkbox"
                                    name="artTitleYn"
                                    id="letter-artTitle-yn"
                                    inputProps={{ label: '기사 제목 포함', custom: true, checked: temp.artTitleYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </div>
                        </Col>
                        <p className="mb-0">발송 제목 형식</p>
                        <Col xs={10} className="p-0 pl-3">
                            <MokaInput value={sendTitleType} disabled />
                        </Col>
                    </div>
                </Form.Row>
            )}

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />
        </>
    );
});

export default NewsLetterSendInfo;
