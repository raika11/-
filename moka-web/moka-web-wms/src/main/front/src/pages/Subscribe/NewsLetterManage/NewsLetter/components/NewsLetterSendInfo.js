import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { MokaInput, MokaInputLabel } from '@/components';
import toast from '@/utils/toastUtil';

/**
 * 뉴스레터 편집 > 발송정보 설정
 */
const NewsLetterSendInfo = ({ temp, setTemp, onChangeValue }) => {
    const [weekArr, setWeekArr] = useState([]);
    const [sn, setSn] = useState('ja');

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'sn') {
            setSn(value);
        } else {
            onChangeValue({ [name]: value });
        }
    };

    useEffect(() => {
        if (sn === 'ja') {
            setTemp({ ...temp, senderName: '중앙일보', senderEmail: 'root@joongang.co.kr' });
        } else {
            setTemp({ ...temp, senderName: '', senderEmail: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sn]);

    return (
        <>
            {/* 뉴스레터 발송정보 */}
            <p className="mb-2">※ 발송정보 설정</p>
            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="발송 주기" />
                <div className="flex-fill">
                    <div className="mb-1 d-flex align-items-center">
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                value="S"
                                name="sendPeriod"
                                id="letter-sendPeriod-s"
                                className="mr-2"
                                inputProps={{ label: '일정', custom: true, checked: temp.sendPeriod === 'S' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" name="sendPeriodType" value={temp.sendPeriodType} onChange={handleChangeValue} disabled={temp.sendPeriod !== 'S'}>
                                <option value="W">요일별</option>
                                <option value="M">월</option>
                            </MokaInput>
                        </Col>
                        {temp.sendPeriodType === 'W' && (
                            <>
                                <ToggleButtonGroup
                                    type="checkbox"
                                    size="sm"
                                    className="mr-2"
                                    value={weekArr}
                                    onChange={(value) => {
                                        setWeekArr(value);
                                        if (weekArr.length > 0) {
                                            let sd = value.join('');
                                            setTemp({ ...temp, sendDay: sd });
                                        } else {
                                            setTemp({ ...temp, sendDay: '' });
                                        }
                                    }}
                                >
                                    <ToggleButton variant="outline-table-btn" value="1" disabled={temp.sendPeriod !== 'S'}>
                                        월
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="2" disabled={temp.sendPeriod !== 'S'}>
                                        화
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="3" disabled={temp.sendPeriod !== 'S'}>
                                        수
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="4" disabled={temp.sendPeriod !== 'S'}>
                                        목
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="5" disabled={temp.sendPeriod !== 'S'}>
                                        금
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="6" disabled={temp.sendPeriod !== 'S'}>
                                        토
                                    </ToggleButton>
                                    <ToggleButton variant="outline-table-btn" value="0" disabled={temp.sendPeriod !== 'S'}>
                                        일
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <MokaInput
                                    as="dateTimePicker"
                                    className="right"
                                    value={temp.sendTime}
                                    inputProps={{ dateFormat: null }}
                                    disabled={temp.sendPeriod !== 'S'}
                                    onChange={(date) => {
                                        if (typeof date === 'object') {
                                            setTemp({ ...temp, sendTime: date });
                                        } else {
                                            setTemp({ ...temp, sendTime: null });
                                        }
                                    }}
                                />
                            </>
                        )}
                        {temp.sendPeriodType === 'M' && (
                            <>
                                <p className="mb-0 pr-2">매 월</p>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput as="select" name="day" value={temp.day} onChange={handleChangeValue} disabled={temp.sendPeriod !== 'S'}>
                                        {[...Array(30)].map((d, idx) => {
                                            return (
                                                <option key={idx} value={idx + 1}>
                                                    {idx + 1}
                                                </option>
                                            );
                                        })}
                                    </MokaInput>
                                </Col>
                                <p className="mb-0 pr-2">일</p>
                                <Col xs={3} className="p-0">
                                    <MokaInput as="dateTimePicker" className="right" inputProps={{ dateFormat: null }} disabled={temp.sendPeriod !== 'S'} />
                                </Col>
                            </>
                        )}
                    </div>
                    {temp.sendType === 'A' && (
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={5} className="p-0 d-flex align-items-center">
                                <MokaInputLabel
                                    as="select"
                                    className="flex-fill"
                                    value={temp.item}
                                    label="신규 콘텐츠"
                                    disabled={temp.sendPeriod !== 'S'}
                                    onChange={handleChangeValue}
                                >
                                    <option>1</option>
                                </MokaInputLabel>
                                <p className="mb-0 ml-2">개 이상</p>
                            </Col>
                        </div>
                    )}
                    <div className="d-flex align-items-center">
                        {temp.sendType === 'A' && (
                            <>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        name="sendPeriod"
                                        value="C"
                                        id="contents"
                                        inputProps={{ label: '콘텐츠', custom: true, checked: temp.sendPeriod === 'C' ? true : false }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={5} className="p-0 d-flex align-items-center">
                                    <MokaInputLabel
                                        as="select"
                                        label="신규 콘텐츠"
                                        className="flex-fill"
                                        value={temp.item}
                                        disabled={temp.sendPeriod !== 'C'}
                                        onChange={handleChangeValue}
                                    >
                                        <option>1</option>
                                    </MokaInputLabel>
                                    <p className="mb-0 ml-1">개 이상</p>
                                </Col>
                            </>
                        )}
                        {temp.sendType === 'E' && (
                            <>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput as="radio" value="D" id="direct" inputProps={{ label: '직접 입력', custom: true }} disabled />
                                </Col>
                                <MokaInput className="flex-fill" disabled />
                            </>
                        )}
                    </div>
                </div>
            </Form.Row>
            {temp.sendType === 'M' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 일시" />
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} />
                    </Col>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                    </Col>
                    <MokaInput as="checkbox" id="immediate" inputProps={{ label: '즉시', custom: true }} disabled />
                </Form.Row>
            )}
            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="발송자 명" />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="sn" value={sn} onChange={handleChangeValue}>
                        <option value="ja">중앙일보</option>
                        <option value="">직접 입력</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput name="senderName" value={temp.senderName} onChange={handleChangeValue} readOnly={sn === 'ja' ? true : false} />
                </Col>
                <MokaInput name="senderEmail" value={temp.senderEmail} onChange={handleChangeValue} readOnly={sn === 'ja' ? true : false} />
            </Form.Row>
            <Form.Row className="align-items-center">
                {temp.sendType === 'A' && (
                    <>
                        <MokaInputLabel as="none" label="발송 시작일" />
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                value={temp.sendStartDt}
                                inputProps={{ timeFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        const nd = new Date();
                                        const diff = moment(nd).diff(date, 'days');
                                        if (diff > 0) {
                                            toast.warning('현재 기준 과거 날짜는 선택할 수 없습니다.');
                                            return;
                                        } else {
                                            setTemp({ ...temp, sendStartDt: date });
                                        }
                                    } else {
                                        setTemp({ ...temp, sendDt: null });
                                    }
                                }}
                            />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                value={temp.sendTime}
                                inputProps={{ dateFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setTemp({ ...temp, sendTime: date });
                                    } else {
                                        setTemp({ ...temp, sendTime: null });
                                    }
                                }}
                            />
                        </Col>
                    </>
                )}
                {temp.sendType === 'E' && (
                    <>
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
                                    />
                                </Col>
                                <Col xs={3} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        name="scbLinkYn"
                                        value="N"
                                        id="letter-scbLinkYn-n"
                                        inputProps={{ label: '직접 등록', custom: true, checked: temp.scbLinkYn === 'N' }}
                                    />
                                </Col>
                                {temp.scbLinkYn === 'N' && (
                                    <Button variant="positive" size="sm" style={{ overflow: 'visible' }}>
                                        Excel 업로드
                                    </Button>
                                )}
                            </div>
                            <p className="mb-0 color-primary">※ 직접 등록 시 Excel 업로드는 필수입니다.</p>
                        </div>
                    </>
                )}
            </Form.Row>

            <hr className="divider" />
        </>
    );
};

export default NewsLetterSendInfo;
