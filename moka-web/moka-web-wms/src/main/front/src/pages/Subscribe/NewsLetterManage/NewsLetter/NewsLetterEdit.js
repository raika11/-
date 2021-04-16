import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import { DATE_FORMAT } from '@/constants';
import NewsLetterPackageModal from './modals/NewsLetterPackageModal';
import ReporterListModal from '@/pages/Reporter/modals/ReporterListModal';
import NewsLetterLayoutModal from './modals/NewLetterLayoutModal';
import NewsLetterEditFormModal from './modals/NewsLetterEditFormModal';
import { EditThumbModal } from '@/pages/Desking/modals';
import { initialState } from '@store/newsLetter';
import toast from '@/utils/toastUtil';

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
    const [weekArr, setWeekArr] = useState([]);
    const [sn, setSn] = useState('root');
    const [pkgModal, setPkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);
    const [layoutModal, setLayoutModal] = useState(false);
    const [editFormModal, setEditFormModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { type, name, value, checked } = e.target;
        if (name === 'sn') {
            setSn(value);
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        if (data) {
            setTemp({ ...temp, thumbnailFile: data });
        } else {
            setTemp({ ...temp, imgUrl: null, thumbnailFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setTemp({ ...temp, imgUrl: imageSrc, thumbnailFile: file });
    };

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
        if (sn === 'root') {
            setTemp({ ...temp, senderName: '중앙일보', senderEmail: 'root@joongang.co.kr' });
        } else {
            setTemp({ ...temp, senderName: '', senderEmail: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sn]);

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
                    text: '임시 저장',
                    variant: 'positive-a',
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
                {letterSeq && (
                    <>
                        <Form.Row className="mb-2 align-items-center">
                            <MokaInputLabel as="none" label="상태" />
                            <MokaInput
                                as="radio"
                                value="A"
                                name="state"
                                id="active"
                                className="mr-2"
                                inputProps={{ label: '활성', custom: true, checked: temp.state === 'A' ? true : false }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="T"
                                name="state"
                                id="temp-storage"
                                className="mr-2"
                                inputProps={{ label: '임시 저장', custom: true, checked: temp.state === 'T' ? true : false }}
                                disabled={temp.state !== 'T'}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="S"
                                name="state"
                                id="stop"
                                className="mr-2"
                                inputProps={{ label: '중지', custom: true, checked: temp.state === 'S' ? true : false }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="E"
                                name="state"
                                id="end"
                                className="mr-2"
                                inputProps={{ label: '종료', custom: true, checked: temp.state === 'E' ? true : false }}
                                onChange={handleChangeValue}
                            />
                            <Col xs={3} className="p-0 d-flex justify-content-end">
                                <MokaInputLabel label="A/B TEST 여부" disabled />
                            </Col>
                        </Form.Row>
                        <hr className="divider" />
                    </>
                )}
                {/* 기본정보 설정 */}
                <p className="mb-2">※ 기본정보 설정</p>

                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 방법" />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="radio"
                            value="A"
                            name="sendType"
                            id="letter-sendType-a"
                            inputProps={{ label: '자동', custom: true, checked: temp.sendType === 'A' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={2} className="p-0">
                        <MokaInput
                            as="radio"
                            value="E"
                            name="sendType"
                            id="letter-sendType-e"
                            inputProps={{ label: '수동', custom: true, checked: temp.sendType === 'E' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="유형" />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="radio"
                            name="letterType"
                            value="O"
                            id="letter-type-org"
                            inputProps={{ label: '오리지널', custom: true, checked: temp.letterType === 'O' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="radio"
                            name="letterType"
                            value="B"
                            id="letter-type-briefing"
                            inputProps={{ label: '브리핑', custom: true, checked: temp.letterType === 'B' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={2} className={temp.sendType === 'M' ? 'p-0 pr-2' : 'p-0'}>
                        <MokaInput
                            as="radio"
                            name="letterType"
                            value="N"
                            id="letter-type-notice"
                            inputProps={{ label: '알림', custom: true, checked: temp.letterType === 'N' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    {temp.sendType === 'E' && (
                        <Col xs={2} className="p-0">
                            <MokaInput
                                as="radio"
                                name="letterType"
                                value="E"
                                id="letter-type-etc"
                                inputProps={{ label: '기타', custom: true, checked: temp.letterType === 'E' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    )}
                </Form.Row>

                {temp.sendType === 'A' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="발송 콘텐츠 선택" />
                        <div className="flex-fill">
                            <div className="mb-1 d-flex align-items-center" style={{ height: 31 }}>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        name="channelType"
                                        value="ISSUE"
                                        id="letter-channelType-article-issue"
                                        inputProps={{ label: '이슈', custom: true, checked: temp.channelType === 'ISSUE' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        name="channelType"
                                        value="TOPIC"
                                        id="letter-channelType-article-topic"
                                        inputProps={{ label: '토픽', custom: true, checked: temp.channelType === 'TOPIC' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        name="channelType"
                                        value="SERIES"
                                        id="letter-channelType-article-series"
                                        inputProps={{ label: '연재', custom: true, checked: temp.channelType === 'SERIES' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={3} className="p-0">
                                    <MokaInput
                                        as="radio"
                                        name="channelType"
                                        value="ARTICLE"
                                        id="letter-channelType-article-pkg"
                                        inputProps={{ label: '기사 패키지', custom: true, checked: temp.channelType === 'ARTICLE' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                            </div>
                            <div className="mb-1 d-flex align-items-center">
                                <MokaInputLabel as="none" label="연결 이슈 선택" labelWidth={80} />
                                <MokaSearchInput
                                    className="flex-fill"
                                    value={temp.channelId}
                                    placeholder="연계 패키지를 검색하세요"
                                    onSearch={() => setPkgModal(true)}
                                    onChange={handleChangeValue}
                                    inputProps={{ readOnly: true }}
                                    disabled={temp.channelType === '' ? true : false}
                                />
                                <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} />
                            </div>
                            <div className="mb-1 d-flex align-items-center">
                                <Col xs={6} className="p-0 pr-20 d-flex align-items-center">
                                    <div className="mr-2" style={{ width: 80 }}>
                                        <MokaInput
                                            as="radio"
                                            value="REPORTER"
                                            name="channelType"
                                            id="letter-channelType-reporter"
                                            inputProps={{ label: '기자', custom: true, checked: temp.channelType === 'REPORTER' }}
                                            onChange={handleChangeValue}
                                        />
                                    </div>
                                    <MokaSearchInput
                                        placeholder=""
                                        value={temp.channelDataId}
                                        onSearch={() => setReporterModal(true)}
                                        onChange={handleChangeValue}
                                        inputProps={{ readOnly: true }}
                                        disabled={temp.channelType === '' ? true : false}
                                    />
                                    <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} />
                                </Col>
                                <Col xs={6} className="p-0 pl-20 d-flex align-items-center">
                                    <div className="mr-2" style={{ width: 80 }}>
                                        <MokaInput
                                            as="radio"
                                            value="JPOD"
                                            name="channelType"
                                            id="letter-channelType-jpod"
                                            inputProps={{ label: 'J팟', custom: true, checked: temp.channelType === 'JPOD' }}
                                            onChange={handleChangeValue}
                                        />
                                    </div>
                                    <MokaSearchInput
                                        placeholder=""
                                        value={temp.channelDataId}
                                        inputProps={{ readOnly: true }}
                                        disabled={temp.channelType === '' ? true : false}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                            </div>
                            <div className="d-flex align-items-center" style={{ height: 31 }}>
                                <Col xs={3} className="p-0 pr-2">
                                    <MokaInput
                                        as="radio"
                                        value="TREND"
                                        name="channelType"
                                        id="letter-channelType-trend"
                                        inputProps={{ label: '트렌드 뉴스', custom: true, checked: temp.channelType === 'TREND' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={3} className="p-0">
                                    <MokaInput
                                        as="radio"
                                        value=""
                                        name="channelType"
                                        id="letter-channelType-null"
                                        inputProps={{ label: '해당 없음', custom: true, checked: temp.channelType === '' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                            </div>
                        </div>
                    </Form.Row>
                )}
                <MokaInputLabel label="뉴스레터 명" className="mb-2" value={temp.letterName} onChange={handleChangeValue} />
                <MokaInputLabel as="textarea" label="뉴스레터 설명" value={temp.letterDesc} inputClassName="resize-none" inputProps={{ rows: 3 }} onChange={handleChangeValue} />

                <hr className="divider" />

                {/* 발송정보 설정 */}
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
                                        <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} disabled={temp.sendPeriod !== 'S'} />
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
                            {temp.sendType === 'M' && (
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
                            <option value="root">중앙일보</option>
                            <option value="">직접 입력</option>
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput name="senderName" value={temp.senderName} onChange={handleChangeValue} readOnly={sn === 'root' ? true : false} />
                    </Col>
                    <MokaInput name="senderEmail" value={temp.senderEmail} onChange={handleChangeValue} readOnly={sn === 'root' ? true : false} />
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
                                        <MokaInput as="radio" value="S" id="direct" inputProps={{ label: '구독자 연동', custom: true }} disabled />
                                    </Col>
                                    <Col xs={3} className="p-0 pr-2">
                                        <MokaInput as="radio" value="D" id="direct" inputProps={{ label: '직접 등록', custom: true }} disabled />
                                    </Col>
                                    <Button variant="positive" size="sm" style={{ overflow: 'visible' }}>
                                        Excel 업로드
                                    </Button>
                                </div>
                                <p className="mb-0 color-primary">※ 직접 등록 시 Excel 업로드는 필수입니다.</p>
                            </div>
                        </>
                    )}
                </Form.Row>
                <hr className="divider" />

                {/* 뉴스레터 설정 */}
                <p className="mb-2">※ 뉴스레터 설정</p>
                <Form.Row className="mb-2 align-items-center">
                    {temp.sendType === 'A' && (
                        <>
                            <MokaInputLabel
                                as="imageFile"
                                className="mr-2"
                                label={
                                    <React.Fragment>
                                        상단 이미지 선택
                                        <br />
                                        <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                inputProps={{ img: temp.imgUrl, setFileValue: handleFileValue, width: 190, deleteButton: true, accept: 'image/jpeg, image/png, image/gif' }}
                            />

                            {/* 포토 아카이브 모달 */}
                            <EditThumbModal
                                show={imgModal}
                                cropWidth={290}
                                cropHeight={180}
                                onHide={() => setImgModal(false)}
                                thumbFileName={temp.imgUrl}
                                apply={handleThumbFileApply}
                            />
                            <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                        </>
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
                <Form.Row className="mb-2 align-items-center">
                    {temp.editLetterType !== 'D' && (
                        <>
                            <MokaInputLabel as="none" label="레이아웃 선택" />
                            <div className="flex-fill">
                                <div className="d-flex align-items-center">
                                    <MokaSearchInput
                                        placeholder="레이아웃을 검색해 주세요"
                                        className="flex-fill"
                                        onSearch={() => setLayoutModal(true)}
                                        inputProps={{ readOnly: true }}
                                    />
                                    <NewsLetterLayoutModal show={layoutModal} onHide={() => setLayoutModal(false)} />
                                </div>
                                <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시 저장 상태 값으로 지정됩니다.</p>
                            </div>
                        </>
                    )}
                    {temp.sendType === 'E' && temp.editLetterType === 'D' && (
                        <>
                            <MokaInputLabel
                                as="imageFile"
                                className="mr-2"
                                label={
                                    <React.Fragment>
                                        상단 이미지 선택
                                        <br />
                                        <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                inputProps={{ img: temp.imgUrl, setFileValue: handleFileValue, width: 190, deleteButton: true, accept: 'image/jpeg, image/png, image/gif' }}
                            />

                            {/* 포토 아카이브 모달 */}
                            <EditThumbModal
                                show={imgModal}
                                cropWidth={290}
                                cropHeight={180}
                                onHide={() => setImgModal(false)}
                                thumbFileName={temp.imgUrl}
                                apply={handleThumbFileApply}
                            />
                            <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                        </>
                    )}
                </Form.Row>
                {temp.sendType === 'E' && temp.editLetterType === 'L' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="편집 폼 선택" />
                        <MokaSearchInput placeholder="편집 폼을 검색해 주세요" className="flex-fill" onSearch={() => setEditFormModal(true)} inputProps={{ readOnly: true }} />
                        <NewsLetterEditFormModal show={editFormModal} onHide={() => setEditFormModal(false)} />
                    </Form.Row>
                )}
                <Form.Row className="align-items-center">
                    <MokaInputLabel as="none" label="제목" />
                    {temp.sendType === 'A' && (
                        <>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput name="letterTitle" value={temp.letterTitle} onChange={handleChangeValue} disabled={temp.titleType !== 'E'} />
                            </Col>
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="titleType"
                                value="A"
                                id="letter-titleType-a"
                                inputProps={{ label: '광고', custom: true, checked: temp.titleType === 'A' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="titleType"
                                value="N"
                                id="letter-titleType-n"
                                inputProps={{ label: '뉴스레터 명', custom: true, checked: temp.titleType === 'N' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="titleType"
                                value="E"
                                id="letter-titleType-e"
                                inputProps={{ label: '직접 입력', custom: true, checked: temp.titleType === 'E' }}
                                onChange={handleChangeValue}
                            />
                            {/* <hr className="vertical-divider" /> */}
                            <MokaInput
                                as="checkbox"
                                name="titleType"
                                value="T"
                                id="letter-titleType-t"
                                inputProps={{ label: '기사 제목', custom: true, checked: temp.titleType === 'E' ? true : false }}
                                onChange={handleChangeValue}
                                disabled
                            />
                        </>
                    )}
                    {temp.sendType === 'E' && <MokaInput className="flex-fill" disabled />}
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
