import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import toast from '@/utils/toastUtil';
import NewsLetterLayoutModal from '../modals/NewsLetterLayoutModal';
import { EditThumbModal } from '@/pages/Desking/modals';
import { DB_DATEFORMAT, DATE_FORMAT } from '@/constants';

/**
 * 뉴스레터 편집 > 발송정보 설정
 */
const NewsLetterSendInfo = forwardRef(({ temp, setTemp, onChangeValue }, ref) => {
    const [weekArr, setWeekArr] = useState([]);
    const [sn, setSn] = useState('ja');
    const [sendTime, setSendTime] = useState({
        D: null,
        W: null,
        M: null,
    });
    const [sendStartDt, setSendStartDt] = useState({
        date: null,
        time: null,
    });
    const [layoutModal, setLayoutModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);
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
        } else if (name === 'subTitleType') {
            if (checked) {
                onChangeValue({ titleType: temp.titleType + 'T' });
            } else {
                onChangeValue({ titleType: temp.titleType.replace('T', '') });
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
        setTemp({ ...temp, headerImgFile: data });
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setTemp({ ...temp, headerImg: imageSrc, headerImgFile: file });
    };

    useImperativeHandle(
        ref,
        () => ({
            sender: senderInfoRef.current,
        }),
        [],
    );

    useEffect(() => {
        // 발송 시작일 상태 초기화
        const nd = new Date();
        setSendStartDt({ ...sendStartDt, date: null, time: moment(nd).startOf('day').format('HH:mm') });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sendStartDt.date && sendStartDt.time) {
            let nd = `${moment(sendStartDt.date).format(DATE_FORMAT)} ${moment(sendStartDt.time).format('HH:mm')}`;
            setTemp({ ...temp, sendStartDt: nd });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendStartDt]);

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
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="발송 조건" required />
                <Col xs={5} className="p-0 d-flex align-items-center">
                    <MokaInput as="radio" value="N" inputProps={{ label: '최신 등록순', custom: true, checked: temp.sendOrder === 'N' }} onChange={handleChangeValue} />
                    <MokaInput as="radio" value="H" inputProps={{ label: '조회 높은순', custom: true, checked: temp.sendOrder === 'H' }} onChange={handleChangeValue} />
                </Col>
                <p className="mb-0 mr-2">신규 콘텐츠</p>
                <Col xs={3} className="p-0 d-flex align-items-center">
                    <MokaInput value={temp.sendMinCnt} onChange={handleChangeValue} />
                    <p className="mb-0 mx-2">~</p>
                    <MokaInput value={temp.sendMaxCnt} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
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
                        <MokaInput
                            as="dateTimePicker"
                            value={sendTime.D}
                            inputProps={{ dateFormat: null, width: 120 }}
                            disabled={temp.sendPeriod !== 'D'}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSendTime({ ...sendTime, D: date });
                                    setTemp({ ...temp, sendTime: date });
                                } else {
                                    setSendTime({ ...sendTime, D: null });
                                    setTemp({ ...temp, sendTime: null });
                                }
                            }}
                        />
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
                            value={sendTime.W}
                            inputProps={{ dateFormat: null, width: 120 }}
                            disabled={temp.sendPeriod !== 'W'}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSendTime({ ...sendTime, W: date });
                                    setTemp({ ...temp, sendTime: date });
                                } else {
                                    setSendTime({ ...sendTime, W: null });
                                    setTemp({ ...temp, sendTime: null });
                                }
                            }}
                        />
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
                            <MokaInput as="select" name="sendDay" value={temp.sendDay} onChange={handleChangeValue} disabled={temp.sendPeriod !== 'M'}>
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
                        <MokaInput
                            as="dateTimePicker"
                            className="right"
                            value={sendTime.M}
                            inputProps={{ dateFormat: null, width: 120 }}
                            disabled={temp.sendPeriod !== 'M'}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSendTime({ ...sendTime, M: date });
                                    setTemp({ ...temp, sendTime: date });
                                } else {
                                    setSendTime({ ...sendTime, M: null });
                                    setTemp({ ...temp, sendTime: null });
                                }
                            }}
                        />
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
            <Form.Row className="mb-2 align-items-center">
                {temp.sendType === 'A' && (
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
                )}
                {temp.sendType === 'E' && (
                    <>
                        <MokaInputLabel as="none" label="형식 구분" />
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                name="editLetterType"
                                value="L"
                                id="letter-editLetterType-l"
                                inputProps={{ label: '레이아웃 선택', custom: true, checked: temp.editLetterType === 'L' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                name="editLetterType"
                                value="F"
                                id="letter-editLetterType-f"
                                inputProps={{ label: '직접 등록', custom: true, checked: temp.editLetterType === 'F' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </>
                )}
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
                                            toast.warning('현재 기준 과거 날짜는 선택할 수 없습니다.');
                                            setSendStartDt({ ...sendStartDt, date: moment(nd, DATE_FORMAT) });
                                        } else {
                                            setSendStartDt({ ...sendStartDt, date: date });
                                            // setTemp({ ...temp, sendStartDt: date });
                                        }
                                    } else {
                                        setSendStartDt({ ...sendStartDt, date: null });
                                        // setTemp({ ...temp, sendStartDt: null });
                                    }
                                }}
                            />
                        </Col>
                        <MokaInput
                            as="dateTimePicker"
                            value={sendStartDt.time}
                            inputProps={{ dateFormat: null, width: 120 }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSendStartDt({ ...sendStartDt, time: date });
                                    // setTemp({ ...temp, sendTime: date });
                                } else {
                                    setSendStartDt({ ...sendStartDt, time: null });
                                    // setTemp({ ...temp, sendTime: null });
                                }
                            }}
                        />
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
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="발송 제목" required />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="titleType" value={temp.titleType} onChange={handleChangeValue}>
                        <option value={temp.titleType && temp.titleType.indexOf('T') > 0 ? 'AT' : 'A'}>광고</option>
                        <option value={temp.titleType && temp.titleType.indexOf('T') > 0 ? 'NT' : 'N'}>레터명</option>
                        <option value={temp.titleType && temp.titleType.indexOf('T') > 0 ? 'ET' : 'E'}>직접입력</option>
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 pr-2">
                    <MokaInput
                        name="letterTitle"
                        value={temp.letterTitle}
                        onChange={handleChangeValue}
                        disabled={temp.titleType && temp.titleType.indexOf('E') > -1 ? false : true}
                    />
                </Col>
                <MokaInput
                    as="checkbox"
                    name="subTitleType"
                    id="letter-subTitleType-t"
                    inputProps={{ label: '기사 제목', custom: true, checked: (temp.titleType || '') && temp.titleType.indexOf('T') > 0 }}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />
        </>
    );
});

export default NewsLetterSendInfo;
