import React, { useState } from 'react';
import { useParams } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import NewsLetterPackageModal from './modals/NewsLetterPackageModal';
import ReporterListModal from '@/pages/Reporter/modals/ReporterListModal';
import NewsLetterLayoutModal from './modals/NewLetterLayoutModal';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = ({ match }) => {
    const { letterSeq } = useParams();
    const [temp, setTemp] = useState({
        state: 'T',
        sendType: 'A',
        pkg: '',
        reporter: '',
        sendCycle: 'S',
        sendCycleType: 'week',
        day: 1,
        item: '',
    });
    const [pkgModal, setPkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);
    const [layoutModal, setLayoutModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

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
                    text: '등록',
                    variant: 'positive',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    variant: 'negative',
                },
            ].filter(Boolean)}
        >
            <Form>
                {letterSeq && (
                    <>
                        <Form.Row className="mb-2 align-items-center">
                            <MokaInputLabel as="none" label="상태" />
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    value="A"
                                    name="state"
                                    id="active"
                                    inputProps={{ label: '활성', custom: true, checked: temp.state === 'A' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    value="T"
                                    name="state"
                                    id="temp-storage"
                                    inputProps={{ label: '임시 저장', custom: true, checked: temp.state === 'T' ? true : false }}
                                    disabled={temp.state !== 'T'}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    value="S"
                                    name="state"
                                    id="stop"
                                    inputProps={{ label: '중지', custom: true, checked: temp.state === 'S' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    value="E"
                                    name="state"
                                    id="end"
                                    inputProps={{ label: '종료', custom: true, checked: temp.state === 'E' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
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
                        <MokaInput as="radio" value="O" id="org" inputProps={{ label: '오리지널', custom: true }} disabled />
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="radio" value="B" id="brief" inputProps={{ label: '브리핑', custom: true }} disabled />
                    </Col>
                    <Col xs={2} className={temp.sendType === 'M' ? 'p-0 pr-2' : 'p-0'}>
                        <MokaInput as="radio" value="N" id="notice" inputProps={{ label: '알림', custom: true }} disabled />
                    </Col>
                    {temp.sendType === 'M' && (
                        <Col xs={2} className="p-0">
                            <MokaInput as="radio" value="E" id="etc" inputProps={{ label: '기타', custom: true }} disabled />
                        </Col>
                    )}
                </Form.Row>
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
                            <Col xs={3} className="p-0 pr-2">
                                <p className="mb-0">연결 이슈 선택</p>
                            </Col>
                            <Col xs={7} className="p-0">
                                <MokaSearchInput className="flex-fill" value={temp.pkg} placeholder="" onSearch={() => setPkgModal(true)} onChange={handleChangeValue} />
                            </Col>
                            <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={6} className="p-0 pr-20 d-flex align-items-center">
                                <div className="mr-2" style={{ width: 80 }}>
                                    <MokaInput as="radio" value="R" id="reporter" inputProps={{ label: '기자', custom: true }} disabled />
                                </div>
                                <MokaSearchInput placeholder="" value={temp.reporter} onSearch={() => setReporterModal(true)} onChange={handleChangeValue} />
                                <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} />
                            </Col>
                            <Col xs={6} className="p-0 pl-20 d-flex align-items-center">
                                <div className="mr-2" style={{ width: 80 }}>
                                    <MokaInput as="radio" value="J" id="jpod" inputProps={{ label: 'J팟', custom: true }} disabled />
                                </div>
                                <MokaSearchInput placeholder="" disabled />
                            </Col>
                        </div>
                        <div className="d-flex align-items-center" style={{ height: 31 }}>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="radio" value="T" id="trend" inputProps={{ label: '트렌드 뉴스', custom: true }} disabled />
                            </Col>
                            <Col xs={3} className="p-0">
                                <MokaInput as="radio" value="N" id="na" inputProps={{ label: '해당 없음', custom: true }} disabled />
                            </Col>
                        </div>
                    </div>
                </Form.Row>
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
                                    <ButtonGroup className="mr-2">
                                        <Button size="sm" variant="outline-table-btn">
                                            월
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            화
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            수
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            목
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            금
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            토
                                        </Button>
                                        <Button size="sm" variant="outline-table-btn">
                                            일
                                        </Button>
                                    </ButtonGroup>
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
                                    <p className="mb-0 ml-1">개 이상</p>
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
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="발송자 명" />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" disabled>
                            <option>중앙일보</option>
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
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                            </Col>
                        </>
                    )}
                    {temp.sendType === 'M' && (
                        <>
                            <MokaInputLabel as="none" label="받는이" />
                            <div className="flex-fill">
                                <div className="d-flex align-items-center">
                                    <Col xs={3} className="p-0 pr-2">
                                        <MokaInput as="radio" value="D" id="direct" inputProps={{ label: '구독자 연동', custom: true }} disabled />
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
                            <MokaInputLabel as="none" label="상단 이미지 추가" />
                            <div className="flex-fill">
                                <div className="d-flex align-items-center">
                                    <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible' }}>
                                        찾아보기
                                    </Button>
                                    <MokaInput placeholder="이미지를 추가해 주세요" className="flex-fill" disabled />
                                </div>
                                <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                            </div>
                        </>
                    )}
                    {temp.sendType === 'M' && (
                        <>
                            <MokaInputLabel as="none" label="형식 구분" />
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="radio" value="L" id="layout-M" inputProps={{ label: '레이아웃 선택', custom: true }} disabled />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="radio" value="D" id="direct-M" inputProps={{ label: '직접 등록', custom: true }} disabled />
                            </Col>
                        </>
                    )}
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    {temp.sendType === 'A' && (
                        <>
                            <MokaInputLabel as="none" label="레이아웃 선택" />
                            <div className="flex-fill">
                                <div className="d-flex align-items-center">
                                    <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible' }} onClick={() => setLayoutModal(true)}>
                                        찾아보기
                                    </Button>
                                    <NewsLetterLayoutModal show={layoutModal} onHide={() => setLayoutModal(false)} />
                                    <MokaInput placeholder="레이아웃을 검색해 주세요" className="flex-fill" disabled />
                                </div>
                                <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시 저장 상태 값으로 지정됩니다.</p>
                            </div>
                        </>
                    )}
                    {temp.sendType === 'M' && (
                        <>
                            <MokaInputLabel as="none" label="상단 이미지 선택\n(xxx * xxx px)" />
                            <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible', maxHeight: 31 }}>
                                찾아보기
                            </Button>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput disabled />
                            </Col>
                            <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                        </>
                    )}
                </Form.Row>
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
                            <hr className="vertical-divider" />
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
