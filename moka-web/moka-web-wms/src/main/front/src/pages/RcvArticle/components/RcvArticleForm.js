import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CodeListModal } from '@pages/commons';
import { MokaInputLabel, MokaInput } from '@components';

const RcvArticleForm = ({ reporterList }) => {
    const [codeModalShow, setCodeModalShow] = useState(false);

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={6}>
                    <MokaInputLabel label="기사유형" value="기본" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
                <Col className="p-0 d-flex justify-content-end" xs={6}>
                    <MokaInputLabel label="발행일" value="2020-12-01" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                    <MokaInputLabel label="수신ID" value="41777131" className="mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="출처" value="매체명 노출" className="mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0 d-flex" xs={12}>
                    <MokaInputLabel label="분류표" className="mb-0" as="none" />
                    <div className="flex-fill d-flex">
                        <div style={{ width: 95 }} className="mr-2">
                            <MokaInput value="분류1" disabled />
                        </div>
                        <div style={{ width: 95 }} className="mr-2">
                            <MokaInput value="분류2" disabled />
                        </div>
                        <div style={{ width: 95 }} className="mr-2">
                            <MokaInput value="분류3" disabled />
                        </div>
                        <div style={{ width: 95 }} className="mr-2">
                            <MokaInput value="분류4" disabled />
                        </div>
                        <Button variant="outline-neutral" onClick={() => setCodeModalShow(true)}>
                            통합분류표
                        </Button>
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="제목" className="mb-0" value="기사제목 노출" inputProps={{ plaintext: true }} disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="부제목" className="mb-0" value="부제목 노출" inputProps={{ plaintext: true }} disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0 d-flex" xs={12}>
                    <MokaInputLabel label="본문" className="mb-0" as="none" />
                    <div className="flex-fill">
                        본문 노출 <br />
                        태그 그대로 노출한다
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="기자" className="mb-0" as="autocomplete" inputProps={{ options: reporterList, isMulti: true }} />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={6}>
                    <MokaInputLabel label="태그" className="mb-0" value="태그입력" disabled />
                </Col>
                <Col className="p-0 pl-2 d-flex align-items-center" xs={6}>
                    <Button variant="outline-neutral">추천태그 자동 입력</Button>
                    <p className="mb-0 ml-2">콤마(,) 구분입력</p>
                </Col>
            </Form.Row>

            {/* masterCode 모달 */}
            <CodeListModal show={codeModalShow} onHide={() => setCodeModalShow(false)} />
        </Form>
    );
};

export default RcvArticleForm;
