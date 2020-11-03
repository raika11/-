import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { MokaCard, MokaInputLabel } from '@components';

const AreaEdit = () => {
    const { domainList } = useSelector((store) => ({
        domainList: store.auth.domainList,
    }));

    // state
    const [formType, setFormType] = useState('1depth');
    const [areaNm, setAreaNm] = useState('');
    const [usedYn, setUsedYn] = useState('N');

    return (
        <MokaCard title="편집영역 등록" className="flex-fill">
            {formType === '1depth' && (
                <div className="d-flex justify-content-center">
                    <Col xs={10} className="p-0">
                        {/* 사용여부 */}
                        <Form.Row className="mb-2">
                            <MokaInputLabel
                                className="mb-0"
                                as="switch"
                                labelWidth={87}
                                label="사용여부"
                                id="usedYn"
                                inputProps={{ checked: usedYn === 'Y' }}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setUsedYn('Y');
                                    } else {
                                        setUsedYn('N');
                                    }
                                }}
                            />
                        </Form.Row>
                        {/* 그룹영역명 */}
                        <Form.Row className="mb-2">
                            <Col xs={8} className="p-0">
                                <MokaInputLabel
                                    className="mb-0"
                                    labelWidth={87}
                                    label="그룹 영역명"
                                    placeholder="그룹 영역명을 입력하세요"
                                    value={areaNm}
                                    onChange={(e) => setAreaNm(e.target.value)}
                                />
                            </Col>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" disabled />
                            </Col>
                        </Form.Row>
                        {/* 도메인 */}
                        <MokaInputLabel className="mb-2" as="select" label="도메인" labelWidth={87}>
                            {domainList.map((domain) => (
                                <option key={domain.domainId} value={domain.domianId}>
                                    {domain.domainUrl}
                                </option>
                            ))}
                        </MokaInputLabel>
                        <Card.Footer className="d-flex justify-content-center">
                            <Button className="mr-10">저장</Button>
                            <Button variant="gray150">취소</Button>
                        </Card.Footer>
                    </Col>
                </div>
            )}
            {formType !== '1depth' && <Form.Row>ddggg</Form.Row>}
        </MokaCard>
    );
};

export default AreaEdit;
