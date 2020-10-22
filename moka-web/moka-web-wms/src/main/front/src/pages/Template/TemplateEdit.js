import React, { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import copy from 'copy-to-clipboard';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInputLabel, MokaIcon, MokaInput, MokaInputGroup } from '@components';
import { getTpZone } from '@store/codeMgt';
import { changeTemplate, saveTemplate, hasRelationList, changeInvalidList, deleteTemplate } from '@store/template';
import { notification, toastr } from '@utils/toastUtil';
import CopyModal from './modals/CopyModal';
import AddComponentModal from './modals/AddComponentModal';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    const { templateSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { template, inputTag, tpZoneRows, latestDomainId, invalidList } = useSelector((store) => ({
        template: store.template.template,
        inputTag: store.template.inputTag,
        tpZoneRows: store.codeMgt.tpZoneRows,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.template.invalidList,
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

    // error
    const [teamplateNameError, setTemplateNameError] = useState(false);

    // modal state
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [addComponentModalShow, setAddComponentModalShow] = useState(false);

    // ref
    const imgFileRef = useRef(null);

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'templateName') {
            setTemplateName(value);
            const regex = /[^\s\t\n]+/;
            if (regex.test(value)) {
                setTemplateNameError(false);
            }
        } else if (name === 'templateWidth') {
            setTemplateWidth(value);
        } else if (name === 'cropWidth') {
            setCropWidth(value);
        } else if (name === 'cropHeight') {
            setCropHeight(value);
        } else if (name === 'templateGroup') {
            setTemplateGroup(value);
        } else if (name === 'description') {
            setDescription(value);
        }
    };

    /**
     * 유효성 검사
     * @param {object} template 템플릿데이터
     */
    const validate = (template) => {
        let isInvalid = false;
        let errList = [];

        // 템플릿명 체크
        if (!/[^\s\t\n]+/.test(template.templateName)) {
            errList.push({
                field: 'templateName',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 템플릿 등록
     * @param {object} tmp 템플릿
     */
    const submitTemplate = (tmp) => {
        dispatch(
            saveTemplate({
                actions: [changeTemplate(tmp)],
                callback: ({ header, body }) => {
                    if (header.success) {
                        notification('success', header.message);
                        history.push(`/template/${body.templateSeq}`);
                    } else {
                        notification('warning', header.message || '실패하였습니다');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param {object} e 이벤트
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let temp = {
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

        if (validate(temp)) {
            if (!template.templateSeq || template.templateSeq === '') {
                // 새 템플릿 저장 시에 도메인ID 셋팅
                temp.domain = { domainId: latestDomainId };
            }
            submitTemplate(temp);
        }
    };

    /**
     * 템플릿 삭제
     * @param {object} response response
     */
    const deleteCallback = (response) => {
        if (response.header.success) {
            dispatch(
                deleteTemplate({
                    templateSeq: template.templateSeq,
                    callback: (response) => {
                        if (response.header.success) {
                            notification('success', response.header.message);
                            history.push('/template');
                        } else {
                            notification('warning', response.header.message);
                        }
                    },
                }),
            );
        } else {
            notification('warning', response.header.message);
        }
    };

    /**
     * 삭제 이벤트
     */
    const handleDelete = () => {
        toastr.confirm('정말 삭제하시겠습니까?', {
            onOk: () => {
                dispatch(
                    hasRelationList({
                        templateSeq: template.templateSeq,
                        callback: deleteCallback,
                    }),
                );
            },
            onCancle: () => {},
        });
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
        setCropWidth(template.cropWidth || 0);
        setCropHeight(template.cropHeight || 0);
        setDescription(template.description || '');
        setTemplateWidth(template.templateWidth || 0);
        setTemplateGroup(template.templateGroup || '');
        setTemplateThumb(template.templateThumb);
    }, [template]);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (templateGroup === '' && tpZoneRows.length > 0) {
            setTemplateGroup(tpZoneRows[0].dtlCd);
        }
    }, [templateGroup, tpZoneRows]);

    useEffect(() => {
        // 코드 조회
        dispatch(getTpZone());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'templateName') {
                    setTemplateNameError(true);
                }
            });
        }
    }, [invalidList]);

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
                        <Button variant="primary" className="mr-05" onClick={handleSubmit}>
                            저장
                        </Button>
                        <Button variant="danger" disabled={btnDisabled} onClick={handleDelete}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 템플릿ID */}
                <MokaInputLabel className="mb-2" label="템플릿ID" value={templateSeq || ''} inputProps={{ plaintext: true, readOnly: true }} />
                {/* 템플릿명 */}
                <MokaInputLabel
                    className="mb-2"
                    label="템플릿명"
                    value={templateName}
                    name="templateName"
                    onChange={handleChangeValue}
                    placeholder="템플릿명을 입력하세요"
                    isInvalid={teamplateNameError}
                    required
                />
                {/* 위치그룹 */}
                <MokaInputLabel className="mb-2" label="위치 그룹" as="select" value={templateGroup} onChange={handleChangeValue} name="templateGroup">
                    {tpZoneRows.map((cd) => (
                        <option key={cd.dtlCd} value={cd.dtlCd}>
                            {cd.cdNm}
                        </option>
                    ))}
                </MokaInputLabel>
                {/* 사이즈, 이미지 크기 */}
                <Row className="m-0 mb-2">
                    <Col xs={5} className="p-0 m-0">
                        <MokaInputLabel className="mb-0" label="사이즈" value={templateWidth} onChange={handleChangeValue} type="number" name="templateWidth" />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            label="이미지"
                            labelWidth={51}
                            labelClassName="mr-2"
                            className="mb-0"
                            value={cropWidth}
                            name="cropWidth"
                            onChange={handleChangeValue}
                            type="number"
                        />
                    </Col>
                    <Col xs={3} className="d-flex p-0 pl-2">
                        x <MokaInput className="ml-2 mb-0" value={cropHeight} onChange={handleChangeValue} type="number" name="cropHeight" />
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
                                notification('success', '태그를 복사하였습니다');
                            }}
                        >
                            <MokaIcon iconName="fal-copy" />
                        </Button>
                    }
                />
                {/* 대표이미지 */}
                <MokaInputLabel
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
                <MokaInputLabel label="설명" placeholder="내용설명" value={description} onChange={handleChangeValue} name="description" />
            </Form>

            {/* 템플릿복사 Modal */}
            <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} template={template} />
            {/* 컴포넌트생성 Modal */}
            <AddComponentModal show={addComponentModalShow} onHide={() => setAddComponentModalShow(false)} />
        </MokaCard>
    );
};

export default TemplateEdit;
