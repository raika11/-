import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CodeListModal } from '@pages/commons';
import { MokaInputLabel, MokaInput } from '@components';

const RcvArticleForm = ({ reporterList, inRcv }) => {
    const [codeModalShow, setCodeModalShow] = useState(false);
    const [selectedMasterCode, setSelectedMasterCode] = useState(['', '', '', '']);
    const [selectedReporter, setSelectedReporter] = useState([]);

    /**
     * 마스터코드 변경 모달
     * @param {array} list 마스터코드리스트
     */
    const handleMasterCode = (list) => {
        let result = list.map((code) => code.masterCode);
        if (result.length < 4) result = Array.prototype.concat(result, ['', '', '', '']).splice(0, 4);
        setSelectedMasterCode(result);
    };

    /**
     * 기자 자동완성 변경
     * @param {array} value value
     */
    const handleReporter = (value) => {
        setSelectedReporter(value);
    };

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={6}>
                    <MokaInputLabel label="기사유형" value="기본" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
                <Col className="p-0 d-flex justify-content-end" xs={6}>
                    <MokaInputLabel label="발행일" labelWidth={40} value="2020-12-01" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                    <MokaInputLabel label="수신ID" labelWidth={40} value="41777131" className="mb-0" inputProps={{ plaintext: true }} disabled />
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
                        {selectedMasterCode.map((code, idx) => (
                            <div key={idx} style={{ width: 95 }} className="mr-2">
                                <MokaInput value={code} disabled />
                            </div>
                        ))}
                        <Button variant="outline-neutral" className="ft-12" onClick={() => setCodeModalShow(true)}>
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
                    <MokaInputLabel
                        label="기자"
                        className="mb-0"
                        as="autocomplete"
                        value={selectedReporter}
                        onChange={handleReporter}
                        inputProps={{ options: reporterList || [], isMulti: true, className: 'ft-12', maxMenuHeight: 100 }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={6}>
                    <MokaInputLabel label="태그" className="mb-0" value="태그입력" disabled />
                </Col>
                <Col className="p-0 pl-2 d-flex align-items-center" xs={6}>
                    <Button variant="outline-neutral" className="ft-12 h-100">
                        추천태그 자동 입력
                    </Button>
                    <p className="mb-0 ml-2">콤마(,) 구분입력</p>
                </Col>
            </Form.Row>

            {/* masterCode 모달 */}
            <CodeListModal show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />
        </Form>
    );
};

export default RcvArticleForm;
