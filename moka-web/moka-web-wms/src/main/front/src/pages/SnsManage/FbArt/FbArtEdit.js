import React from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Container, Row, Col, Figure, Button } from 'react-bootstrap';

const FbArtEdit = () => {
    const tempOnchange = (e) => {};

    return (
        <>
            <MokaCard width={550} title={`페이스북 메타 ${true ? '정보' : '등록'}`} titleClassName="mb-0" loading={null}>
                <hr />
                <Container>
                    <Row xs={12}>
                        <Col xs={3} className="pr-0">
                            <div className="d-flex h4">원본 기사</div>
                        </Col>
                        <Col xs={4}>
                            <div className="d-flex">기사 ID 2333234</div>
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col xs={4}>
                            <Figure.Image className="mb-0" src={'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/25ed1572-899d-4bb7-9f59-81059bea0e49.jpg'} />
                        </Col>
                        <Col>
                            <div className="d-flex mb-3 display-5 font-weight-bold text-left">{`프로야구 SK 내야수 김성현, 2021 FA 1호 계약`}</div>
                            <div className="d-flex">
                                <MokaInput
                                    as={'textarea'}
                                    className="resize-none"
                                    value={`SK 와이번스 내야수 김성현(33)이 2021년 1호 자유계약선수(FA) 계약을 했다.

2+1년 최대 11억원에 잔류

SK는 "김성현과 2+1년 최대 11억원에 계약했다. 세부 조건은 계약금 2억원... `}
                                    inputProps={{ plaintext: true, readOnly: true, rows: '4' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <hr />
                <Container>
                    <Row xs={12}>
                        <Col xs={5} className="d-flex">
                            <div className="d-flex h4">페이스북 메타 정보</div>
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col xs={4} className="d-flex p-0 m-0 pl-3" style={{ fontSize: '0.775rem' }}>
                            <Form.Label className="text-danger">{`SNS 이미지 (850*350 px)`}</Form.Label>
                        </Col>
                        <MokaInputLabel
                            labelClassName="d-flex p-0 pl-3"
                            label="사용유무"
                            labelWidth={80}
                            as="none"
                            name="temp-status"
                            id="temp-status"
                            variant="positive"
                            style={{ paddingLeft: '15px' }}
                        />
                        <MokaInputLabel labelClassName="d-flex" as="switch" name="temp-status" id="temp-status" variant="positive" />
                    </Row>
                    <Row xs={12}>
                        <Col xs={4}>
                            <Figure.Image className="mb-0" src={'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/25ed1572-899d-4bb7-9f59-81059bea0e49.jpg'} />
                            <div className="d-flex justify-content-end mb-0 pt-3">
                                <div className="d-flex justify-content-end pr-2">
                                    <Button variant="positive">신규 등록</Button>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button variant="searching">편집</Button>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <MokaInputLabel onChange={(e) => tempOnchange(e)} />
                            <MokaInput as={'textarea'} className="resize-none" value={''} inputProps={{ rows: '5' }} onChange={(e) => tempOnchange(e)} />
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col className="d-flex justify-content-end align-items-end pt-3">
                            <div className="justify-content-end align-items-end pr-2">수정정보 2020-12-03 09:36:00 </div>
                        </Col>
                    </Row>
                </Container>
                <hr />
                <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                    <div className="d-flex justify-content-center">
                        <Button variant="positive" className="mr-05">
                            저장
                        </Button>
                        <Button variant="negative" className="mr-05">
                            취소
                        </Button>
                    </div>
                </div>
            </MokaCard>
        </>
    );
};

export default FbArtEdit;
