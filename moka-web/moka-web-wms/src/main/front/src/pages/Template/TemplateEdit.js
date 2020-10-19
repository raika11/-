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

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    const { templateSeq } = useParams();
    const dispatch = useDispatch();
    const { template, inputTag } = useSelector((store) => ({
        template: store.template.template,
        inputTag: store.template.inputTag,
    }));

    // state
    const [templateName, setTemplateName] = useState('');
    const [templateWidth, setTemplateWidth] = useState('');
    const [cropWidth, setCropWidth] = useState('');
    const [cropHeight, setCropHeight] = useState('');
    const [templateGroup, setTemplateGroup] = useState(undefined);
    const [templateThumb, setTemplateThumb] = useState(undefined);
    const [fileValue, setFileValue] = useState(null);
    const [description, setDescription] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [validated, setValidated] = useState(true);

    // ref
    const imgFileRef = useRef(null);

    useEffect(() => {
        if (templateSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dispatch, templateSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setFileValue(null);
        setTemplateName(template.templateName || '');
        setTemplateWidth(template.templateWidth || '');
        setCropWidth(template.cropWidth || '');
        setCropHeight(template.cropHeight || '');
        setDescription(template.description || '');
        setTemplateGroup(template.templateGroup || '');
        setTemplateThumb(template.templateThumb);
    }, [template]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="템플릿 정보">
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-05" disabled={btnDisabled}>
                            컴포넌트 생성
                        </Button>
                        <Button variant="dark" disabled={btnDisabled}>
                            복사
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05" onClick={() => setValidated(!validated)}>
                            저장
                        </Button>
                        <Button variant="danger" disabled={btnDisabled}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 템플릿ID */}
                <MokaInput className="mb-2" label="템플릿ID" value={templateSeq || ''} inputProps={{ plaintext: true, readOnly: true }} />
                {/* 템플릿명 */}
                <MokaInput className="mb-2" label="템플릿명" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="템플릿명을 입력하세요" />
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
                        <MokaInput label="이미지" labelWidth={55} className="mb-0 pr-1" value={cropWidth} onChange={(e) => setCropWidth(e.target.value)} />
                    </Col>
                    <Col xs={2} className="d-flex p-0">
                        x <MokaInput className="ml-2 mb-0" value={cropHeight} onChange={(e) => setCropHeight(e.target.value)} />
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
                <MokaInput label="설명" placeholder="내용설명" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form>
        </MokaCard>
    );
};

export default TemplateEdit;
