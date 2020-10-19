import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toastr } from 'react-redux-toastr';
import copy from 'copy-to-clipboard';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInput, MokaIcon, MokaInputGroup } from '@components';
import { getTemplate } from '@store/template/templateAction';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    const { templateSeq } = useParams();
    const dispatch = useDispatch();

    // state
    const [validated, setValidated] = useState(true);
    const [fileValue, setFileValue] = useState(null);
    const [inputTag] = useState('<mte:tp id="185" name="모바일 뉴스레터신청" />');

    // ref
    const imgFileRef = useRef(null);

    useEffect(() => {
        if (templateSeq) {
            dispatch(getTemplate({ templateSeq: templateSeq }));
        }
    }, [dispatch, templateSeq]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="템플릿 정보">
            <Form>
                {/* 버튼 그룹 */}
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
                {/* 템플릿ID */}
                <MokaInput className="mb-2" label="템플릿ID" value="25555" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 템플릿명 */}
                <MokaInput className="mb-2" label="템플릿명" value="템플릿명" onChange={() => {}} placeholder="템플릿명을 입력하세요" />
                {/* 위치그룹 */}
                <MokaInput className="mb-2" label="위치 그룹" as="select" isInvalid={!validated}>
                    <option>템플릿 위치설정</option>
                </MokaInput>
                {/* 사이즈, 이미지 크기 */}
                <Row className="m-0 mb-2">
                    <Col xs={6} className="p-0 m-0">
                        <MokaInput className="mb-0" label="사이즈" as="select">
                            <option>사이즈</option>
                        </MokaInput>
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInput label="이미지" labelWidth={55} className="mb-0 pr-1" />
                    </Col>
                    <Col xs={2} className="d-flex p-0">
                        x <MokaInput className="ml-2 mb-0" />
                    </Col>
                </Row>
                {/* 입력태그 */}
                <MokaInputGroup
                    label="입력태그"
                    as="textarea"
                    value={inputTag}
                    inputClassName="resize-none"
                    inputProps={{ rows: 2 }}
                    className="mb-2"
                    disabled
                    append={
                        <Button
                            variant="dark"
                            onClick={() => {
                                copy(inputTag);
                                toastr.success('알림창', '태그를 복사하였습니다.');
                            }}
                        >
                            <MokaIcon iconName="fal-copy" />
                        </Button>
                    }
                />
                {/* 대표이미지 */}
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
                    inputProps={{ width: 284, height: 280, setFileValue }}
                    className="mb-2"
                />
                {/* 설명 */}
                <MokaInput label="설명" placeholder="내용설명" />
            </Form>
        </MokaCard>
    );
};

export default TemplateEdit;
