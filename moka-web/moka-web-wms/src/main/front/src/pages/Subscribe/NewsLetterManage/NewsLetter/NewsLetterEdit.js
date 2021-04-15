import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
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
import toast from '@/utils/toastUtil';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = ({ match }) => {
    const history = useHistory();
    const { letterSeq } = useParams();
    const [temp, setTemp] = useState({
        state: 'T',
        sendType: 'A',
        type: '',
        contents: '',
        pkg: '',
        service: '',
        reporter: '',
        jpod: '',
        sendCycle: 'S',
        sendCycleType: 'week',
        week: [],
        day: 1,
        sendDt: null,
        sendTime: null,
        item: '',
        imgUrl: '',
        thumbnailFile: null,
        manualType: 'L',
    });
    const [pkgModal, setPkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);
    const [layoutModal, setLayoutModal] = useState(false);
    const [editFormModal, setEditFormModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
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

    return (
        <MokaCard
            className="w-100 overflow-hidden"
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
                            id="auto"
                            inputProps={{ label: '자동', custom: true, checked: temp.sendType === 'A' ? true : false }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={2} className="p-0">
                        <MokaInput
                            as="radio"
                            value="M"
                            name="sendType"
                            id="manual"
                            inputProps={{ label: '수동', custom: true, checked: temp.sendType === 'M' ? true : false }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="유형" />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="radio" name="type" value="O" id="org" inputProps={{ label: '오리지널', custom: true }} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="radio" name="type" value="B" id="brief" inputProps={{ label: '브리핑', custom: true }} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={2} className={temp.sendType === 'M' ? 'p-0 pr-2' : 'p-0'}>
                        <MokaInput as="radio" name="type" value="N" id="notice" inputProps={{ label: '알림', custom: true }} onChange={handleChangeValue} />
                    </Col>
                    {temp.sendType === 'M' && (
                        <Col xs={2} className="p-0">
                            <MokaInput as="radio" name="type" value="E" id="etc" inputProps={{ label: '기타', custom: true }} onChange={handleChangeValue} />
                        </Col>
                    )}
                </Form.Row>
                {temp.sendType === 'A' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="발송 콘텐츠 선택" />
                        <div className="flex-fill">
                            <div className="mb-1 d-flex align-items-center" style={{ height: 31 }}>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput as="radio" value="I" id="issue" inputProps={{ label: '이슈', custom: true }} disabled />
                                </Col>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput as="radio" value="T" id="topic" inputProps={{ label: '토픽', custom: true }} disabled />
                                </Col>
                                <Col xs={2} className="p-0 pr-2">
                                    <MokaInput as="radio" value="S" id="series" inputProps={{ label: '연재', custom: true }} disabled />
                                </Col>
                                <Col xs={3} className="p-0">
                                    <MokaInput as="radio" value="P" id="pkg" inputProps={{ label: '기사 패키지', custom: true }} disabled />
                                </Col>
                            </div>
                            <div className="mb-1 d-flex align-items-center">
                                <MokaInputLabel as="none" label="연결 이슈 선택" labelWidth={80} />
                                <MokaSearchInput
                                    className="flex-fill"
                                    value={temp.pkg}
                                    placeholder="연계 패키지를 검색하세요"
                                    onSearch={() => setPkgModal(true)}
                                    onChange={handleChangeValue}
                                    inputProps={{ readOnly: temp.contents === 'N' ? true : false }}
                                />
                                <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} />
                            </div>
                            <div className="mb-1 d-flex align-items-center">
                                <Col xs={6} className="p-0 pr-20 d-flex align-items-center">
                                    <div className="mr-2" style={{ width: 80 }}>
                                        <MokaInput
                                            as="radio"
                                            value="R"
                                            name="service"
                                            id="reporter"
                                            inputProps={{ label: '기자', custom: true }}
                                            disabled={temp.contents === 'N' ? true : false}
                                            onChange={handleChangeValue}
                                        />
                                    </div>
                                    <MokaSearchInput
                                        placeholder=""
                                        value={temp.reporter}
                                        onSearch={() => setReporterModal(true)}
                                        onChange={handleChangeValue}
                                        disabled={temp.contents === 'N' ? true : false}
                                    />
                                    <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} />
                                </Col>
                                <Col xs={6} className="p-0 pl-20 d-flex align-items-center">
                                    <div className="mr-2" style={{ width: 80 }}>
                                        <MokaInput
                                            as="radio"
                                            value="J"
                                            name="service"
                                            id="jpod"
                                            inputProps={{ label: 'J팟', custom: true }}
                                            disabled={temp.contents === 'N' ? true : false}
                                            onChange={handleChangeValue}
                                        />
                                    </div>
                                    <MokaSearchInput placeholder="" value={temp.jpod} disabled={temp.contents === 'N' ? true : false} onChange={handleChangeValue} />
                                </Col>
                            </div>
                            <div className="d-flex align-items-center" style={{ height: 31 }}>
                                <Col xs={3} className="p-0 pr-2">
                                    <MokaInput as="radio" value="T" name="contents" id="trend" inputProps={{ label: '트렌드 뉴스', custom: true }} onChange={handleChangeValue} />
                                </Col>
                                <Col xs={3} className="p-0">
                                    <MokaInput as="radio" value="N" name="contents" id="na" inputProps={{ label: '해당 없음', custom: true }} onChange={handleChangeValue} />
                                </Col>
                            </div>
                        </div>
                    </Form.Row>
                )}
                <MokaInputLabel label="뉴스레터 명" className="mb-2" inputProps={{ disabled: true }} />
                <MokaInputLabel as="textarea" label="뉴스레터 설명" inputClassName="resize-none" inputProps={{ rows: 3 }} disabled />
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
                                    name="sendCycle"
                                    id="schedule"
                                    className="mr-2"
                                    inputProps={{ label: '일정', custom: true, checked: temp.sendCycle === 'S' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput as="select" name="sendCycleType" value={temp.sendCycleType} onChange={handleChangeValue} disabled={temp.sendCycle !== 'S'}>
                                    <option value="week">요일별</option>
                                    <option value="month">월</option>
                                </MokaInput>
                            </Col>
                            {temp.sendCycleType === 'week' && (
                                <>
                                    <ToggleButtonGroup
                                        type="checkbox"
                                        size="sm"
                                        name="week"
                                        className="mr-2"
                                        value={temp.week}
                                        onChange={(value) => setTemp({ ...temp, week: value })}
                                    >
                                        <ToggleButton variant="outline-table-btn" value="mon" disabled={temp.sendCycle !== 'S'}>
                                            월
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="tues" disabled={temp.sendCycle !== 'S'}>
                                            화
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="wednes" disabled={temp.sendCycle !== 'S'}>
                                            수
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="thur" disabled={temp.sendCycle !== 'S'}>
                                            목
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="fri" disabled={temp.sendCycle !== 'S'}>
                                            금
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="satur" disabled={temp.sendCycle !== 'S'}>
                                            토
                                        </ToggleButton>
                                        <ToggleButton variant="outline-table-btn" value="sun" disabled={temp.sendCycle !== 'S'}>
                                            일
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} disabled={temp.sendCycle !== 'S'} />
                                </>
                            )}
                            {temp.sendCycleType === 'month' && (
                                <>
                                    <p className="mb-0 pr-2">매 월</p>
                                    <Col xs={2} className="p-0 pr-2">
                                        <MokaInput as="select" name="day" value={temp.day} onChange={handleChangeValue} disabled={temp.sendCycle !== 'S'}>
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
                                        <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} disabled={temp.sendCycle !== 'S'} />
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
                                        disabled={temp.sendCycle !== 'S'}
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
                                            name="sendCycle"
                                            value="C"
                                            id="contents"
                                            inputProps={{ label: '콘텐츠', custom: true, checked: temp.sendCycle === 'C' ? true : false }}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                    <Col xs={5} className="p-0 d-flex align-items-center">
                                        <MokaInputLabel
                                            as="select"
                                            label="신규 콘텐츠"
                                            className="flex-fill"
                                            value={temp.item}
                                            disabled={temp.sendCycle !== 'C'}
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
                        <MokaInput as="select" disabled>
                            <option>중앙일보</option>
                            <option>직접 입력</option>
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput disabled />
                    </Col>
                    <MokaInput placeholder="root@joongang.co.kr" disabled />
                </Form.Row>
                <Form.Row className="align-items-center">
                    {temp.sendType === 'A' && (
                        <>
                            <MokaInputLabel as="none" label="발송 시작일" />
                            <Col xs={4} className="p-0 pr-2">
                                <MokaInput
                                    as="dateTimePicker"
                                    value={temp.sendDt}
                                    inputProps={{ timeFormat: null }}
                                    onChange={(date) => {
                                        if (typeof date === 'object') {
                                            const nd = new Date();
                                            const diff = moment(nd).diff(date, 'days');
                                            if (diff > 0) {
                                                toast.warning('현재 기준 과거 날짜는 선택할 수 없습니다.');
                                                return;
                                            } else {
                                                setTemp({ ...temp, sendDt: date });
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
                    {temp.sendType === 'M' && (
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
                    {temp.sendType === 'M' && (
                        <>
                            <MokaInputLabel as="none" label="형식 구분" />
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="manualType"
                                    value="L"
                                    id="layout-m"
                                    inputProps={{ label: '레이아웃 선택', custom: true, checked: temp.manualType === 'L' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="manualType"
                                    value="D"
                                    id="direct-m"
                                    inputProps={{ label: '직접 등록', custom: true, checked: temp.manualType === 'D' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </>
                    )}
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    {temp.manualType !== 'D' && (
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
                    {temp.sendType === 'M' && temp.manualType === 'D' && (
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
                {temp.sendType === 'M' && temp.manualType === 'L' && (
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
                                <MokaInput disabled />
                            </Col>
                            <MokaInput as="radio" className="mr-2" value="ad" id="issue" inputProps={{ label: '광고', custom: true }} disabled />
                            <MokaInput as="radio" className="mr-2" value="newsLetter" id="issue" inputProps={{ label: '뉴스레터 명', custom: true }} disabled />
                            <MokaInput as="radio" className="mr-2" value="" id="issue" inputProps={{ label: '직접 입력', custom: true }} disabled />
                            {/* <hr className="vertical-divider" /> */}
                            <MokaInput as="checkbox" value="title" id="title" inputProps={{ label: '기사 제목', custom: true }} disabled />
                        </>
                    )}
                    {temp.sendType === 'M' && <MokaInput className="flex-fill" disabled />}
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
