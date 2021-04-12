import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 편집
 */
const NewsLetterEdit = () => {
    return (
        <MokaCard
            className="w-100"
            title="뉴스레터 상품등록"
            footer
            footerButtons={[
                {
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
            ]}
        >
            <Form>
                {/* 기본정보 설정 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 방법" />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="radio" value="A" id="auto" inputProps={{ label: '자동', custom: true }} disabled />
                    </Col>
                    <Col xs={2} className="p-0">
                        <MokaInput as="radio" value="M" id="manual" inputProps={{ label: '수동', custom: true }} disabled />
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
                    <Col xs={2} className="p-0">
                        <MokaInput as="radio" value="N" id="notice" inputProps={{ label: '알림', custom: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="발송 콘텐트 선택" />
                    <div className="flex-fill">
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput as="radio" value="I" id="issue" inputProps={{ label: '이슈', custom: true }} disabled />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput as="radio" value="T" id="topic" inputProps={{ label: '토픽', custom: true }} disabled />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput as="radio" value="S" id="series" inputProps={{ label: '연재', custom: true }} disabled />
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaSearchInput className="flex-fill" disabled />
                            </Col>
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="radio" value="R" id="reporter" inputProps={{ label: '기자', custom: true }} disabled />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput as="radio" value="J" id="jpod" inputProps={{ label: 'J팟', custom: true }} disabled />
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaSearchInput className="flex-fill" disabled />
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
                <MokaInputLabel as="textarea" className="mb-2" label="뉴스레터 설명" inputClassName="resize-none" inputProps={{ rows: 3 }} disabled />

                {/* 발송정보 설정 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="발송 주기" />
                    <div className="flex-fill">
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={2} className="p-0 pr-2">
                                <p className="mb-0">■ 일정</p>
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput as="select" disabled>
                                    <option>요일별</option>
                                </MokaInput>
                            </Col>
                            <ButtonGroup className="pr-2">
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
                            <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                        </div>
                        <div className="d-flex align-items-center">
                            <Col xs={2} className="p-0 pr-2">
                                <p className="mb-0">■ 콘텐츠</p>
                            </Col>
                            <Col xs={5} className="p-0 d-flex align-items-center">
                                <MokaInputLabel as="select" label="신규 콘텐츠" className="flex-fill" disabled>
                                    <option>1</option>
                                </MokaInputLabel>
                                <p className="mb-0 ml-1">개 등록</p>
                            </Col>
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
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 시작일" />
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} />
                    </Col>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                    </Col>
                    <Col xs={2} className="p-0">
                        <MokaInput as="checkbox" value="tempSave" id="tempSave" inputProps={{ label: '임시 저장', custom: true }} disabled />
                    </Col>
                </Form.Row>

                {/* 뉴스레터 설정 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="레이아웃 선택" />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center">
                            <Button variant="searching" className="mr-2" style={{ overflow: 'visible' }}>
                                찾아보기
                            </Button>
                            <MokaInput placeholder="레이아웃을 검색해 주세요" className="flex-fill" disabled />
                        </div>
                        <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시 저장 상태 값으로 지정됩니다.</p>
                    </div>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="제목" />
                    <div className="flex-fill">
                        <MokaInput className="mb-1" disabled />
                        <div className="d-flex align-items-center" style={{ height: 31 }}>
                            <MokaInput as="radio" className="mr-2" value="ad" id="issue" inputProps={{ label: '광고', custom: true }} disabled />
                            <MokaInput as="radio" className="mr-2" value="newsLetter" id="issue" inputProps={{ label: '뉴스레터 명', custom: true }} disabled />
                            <MokaInput as="radio" className="mr-2" value="" id="issue" inputProps={{ label: '직접 입력', custom: true }} disabled />
                            <hr className="vertical-divider" />
                            <MokaInput as="checkbox" value="title" id="title" inputProps={{ label: '기사 제목 포함', custom: true }} disabled />
                        </div>
                    </div>
                </Form.Row>
                <Form.Row>
                    <MokaInputLabel label="테스트 발송" className="mr-2 flex-fill" placeholder="테스트 발송할 이메일을 입력하세요" disabled />
                    <Button variant="positive">발송</Button>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NewsLetterEdit;
