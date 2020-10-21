import React, { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toastr } from 'react-redux-toastr';
import copy from 'copy-to-clipboard';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInput, MokaIcon, MokaInputGroup } from '@components';
import { getTpSize, getTpZone } from '@store/codeMgt/codeMgtAction';
import { changeTemplate, saveTemplate } from '@store/template/templateAction';
import CopyModal from './modals/CopyModal';
import AddComponentModal from './modals/AddComponentModal';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    const { templateSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { template, inputTag, tpZoneRows, latestDomainId } = useSelector((store) => ({
        template: store.template.template,
        inputTag: store.template.inputTag,
        tpZoneRows: store.codeMgt.tpZoneRows,
        latestDomainId: store.auth.latestDomainId,
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

    // modal state
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [addComponentModalShow, setAddComponentModalShow] = useState(false);

    // ref
    const imgFileRef = useRef(null);

    /**
     * validate 함수
     */
    const validate = (template) => {
        return true;
    };

    /**
     * 템플릿 저장
     * @param {object} e 이벤트
     */
    const onSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let newTemplate = {
            ...template,
            templateName,
            templateWidth,
            cropWidth,
            cropHeight,
            templateGroup,
            templateThumb,
            description,
            templateThumbnailFile: fileValue,
        };
        if (validate(newTemplate)) {
            if (!template.templateSeq || template.templateSeq === '') {
                // 새 템플릿 저장 시에 도메인ID 셋팅
                newTemplate.domain = { domainId: latestDomainId };
            }
            dispatch(
                saveTemplate({
                    actions: [changeTemplate(newTemplate)],
                    callback: ({ header, body }) => {
                        if (header.success) {
                            history.push(`/template/${body.templateSeq}`);
                        }
                    },
                }),
            );
        }
    };

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
        setCropWidth(template.cropWidth || '');
        setCropHeight(template.cropHeight || '');
        setDescription(template.description || '');
        setTemplateWidth(template.templateWidth || '');
        setTemplateGroup(template.templateGroup || '');
        setTemplateThumb(template.templateThumb);
    }, [template]);

    useEffect(() => {
        dispatch(getTpZone());
        dispatch(getTpSize());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (templateGroup === '' && tpZoneRows.length > 0) {
            setTemplateGroup(tpZoneRows[0].dtlCd);
        }
    }, [templateGroup, tpZoneRows]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="템플릿 정보">
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-05" disabled={btnDisabled} onClick={() => setAddComponentModalShow(true)}>
                            컴포넌트 생성
                        </Button>
                        <Button variant="dark" disabled={btnDisabled} onClick={() => setCopyModalShow(true)}>
                            복사
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05" onClick={onSave}>
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
                <MokaInput className="mb-2" label="위치 그룹" as="select" value={templateGroup} onChange={(e) => setTemplateGroup(e.target.value)} isInvalid={!validated}>
                    {tpZoneRows.map((cd) => (
                        <option key={cd.dtlCd} value={cd.dtlCd}>
                            {cd.cdNm}
                        </option>
                    ))}
                </MokaInput>
                {/* 사이즈, 이미지 크기 */}
                <Row className="m-0 mb-2">
                    <Col xs={5} className="p-0 m-0">
                        <MokaInput className="mb-0" label="사이즈" value={templateWidth} onChange={(e) => setTemplateWidth(e.target.value)} type="number" />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInput
                            label="이미지"
                            labelWidth={51}
                            labelClassName="mr-2"
                            className="mb-0"
                            value={cropWidth}
                            onChange={(e) => setCropWidth(e.target.value)}
                            type="number"
                        />
                    </Col>
                    <Col xs={3} className="d-flex p-0 pl-2">
                        x <MokaInput className="ml-2 mb-0" value={cropHeight} onChange={(e) => setCropHeight(e.target.value)} type="number" />
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
                    labelClassName="justify-content-end mr-3"
                    inputProps={{ width: 284, height: 280, setFileValue }}
                    className="mb-2"
                />
                {/* 설명 */}
                <MokaInput label="설명" placeholder="내용설명" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form>

            {/* 템플릿복사 Modal */}
            <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} template={template} />
            {/* 컴포넌트생성 Modal */}
            <AddComponentModal show={addComponentModalShow} onHide={() => setAddComponentModalShow(false)} />
        </MokaCard>
    );
};

export default TemplateEdit;
