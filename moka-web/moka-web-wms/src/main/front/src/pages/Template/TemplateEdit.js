import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { MokaCard, MokaInput, MokaIcon } from '@components';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    const [validated, setValidated] = useState(true);
    const imgFileRef = useRef(null);
    const [fileValue, setFileValue] = useState(null);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="템플릿 정보">
            <Form>
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-05">
                            컴포넌트 생성
                        </Button>
                        <Button variant="dark">복사</Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05" onClick={() => setValidated(!validated)}>
                            저장
                        </Button>
                        <Button variant="danger">삭제</Button>
                    </div>
                </Form.Group>
                <MokaInput label="템플릿ID" value="25555" inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInput label="템플릿명" value="템플릿명" onChange={() => {}} placeholder="템플릿명을 입력하세요" />

                {/* invalid 테스트 */}
                <MokaInput label="위치 그룹" as="select" isInvalid={!validated} required>
                    <option>템플릿 위치설정</option>
                </MokaInput>

                <Row className="m-0">
                    <Col xs={6} className="p-0 m-0">
                        <MokaInput label="사이즈" as="select">
                            <option>사이즈</option>
                        </MokaInput>
                    </Col>
                    <Col xs={6} className="d-flex p-0">
                        <MokaInput label="이미지" labelWidth={57} className="pr-1" /> X <MokaInput className="ml-2" required />
                    </Col>
                </Row>

                <MokaInput
                    label="입력태그"
                    as="textarea"
                    value={`<mte:tp id="185" name="모바일 뉴스레터신청" />`}
                    inputClassName="resize-none"
                    inputProps={{ rows: 2 }}
                    disabled
                    // isGroup
                    // inputGroupProps={{
                    //     append: (
                    //         <Button variant="dark">
                    //             <MokaIcon iconName="fal-copy" />
                    //         </Button>
                    //     ),
                    // }}
                />

                {/* <div className="position-relative">
                    <MokaInput
                        label="입력태그"
                        as="textarea"
                        value={`<mte:tp id="185" name="모바일 뉴스레터신청" />`}
                        inputClassName="resize-none"
                        inputProps={{ rows: 2 }}
                        disabled
                    />
                    <Button className="btn-pill absolute-top-right" variant="gray150">
                        <MokaIcon iconName="fal-copy" />
                    </Button>
                </div> */}

                <MokaInput
                    ref={imgFileRef}
                    as="imageFile"
                    label={
                        <>
                            대표이미지
                            <br />
                            <Button
                                className="mt-1"
                                size="sm"
                                style={{ width: 68 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    imgFileRef.current.deleteFile();
                                }}
                            >
                                삭제
                            </Button>
                        </>
                    }
                    labelClassName="justify-content-end"
                    inputProps={{ width: 280, height: 280, setFileValue }}
                />
                <MokaInput label="설명" placeholder="내용설명" />
            </Form>
        </MokaCard>
    );
};

export default TemplateEdit;
