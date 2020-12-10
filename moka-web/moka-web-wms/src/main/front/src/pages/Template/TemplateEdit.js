import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { MokaCard, MokaInputLabel, MokaInput, MokaInputGroup, MokaCopyTextButton } from '@components';
import { getTpZone } from '@store/codeMgt';
import { changeTemplate, saveTemplate, changeInvalidList, hasRelationList, copyTemplate, clearTemplate, GET_TEMPLATE, DELETE_TEMPLATE, SAVE_TEMPLATE } from '@store/template';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { DefaultInputModal } from '@pages/commons';
import AddComponentModal from './modals/AddComponentModal';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { template, inputTag, tpZoneRows = [], latestDomainId, invalidList, UPLOAD_PATH_URL, loading } = useSelector((store) => ({
        template: store.template.template,
        inputTag: store.template.inputTag,
        tpZoneRows: store.codeMgt.tpZoneRows,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.template.invalidList,
        UPLOAD_PATH_URL: store.app.UPLOAD_PATH_URL,
        loading: store.loading[GET_TEMPLATE] || store.loading[DELETE_TEMPLATE] || store.loading[SAVE_TEMPLATE],
    }));

    // state
    const [templateName, setTemplateName] = useState('');
    const [templateWidth, setTemplateWidth] = useState('');
    const [cropWidth, setCropWidth] = useState('');
    const [cropHeight, setCropHeight] = useState('');
    const [templateGroup, setTemplateGroup] = useState(undefined);
    const [templateThumb, setTemplateThumb] = useState(undefined);
    const [fileValue, setFileValue] = useState(null);
    const [thumbSrc, setThumbSrc] = useState();
    const [description, setDescription] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);

    // error
    const [teamplateNameError, setTemplateNameError] = useState(false);

    // modal state
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [addComponentModalShow, setAddComponentModalShow] = useState(false);
    const [copyModalData, setCopyModalData] = useState({
        title: '템플릿명',
        value: '',
        isInvalid: false,
    });

    // ref
    const imgFileRef = useRef(null);

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'templateName') {
            setTemplateName(value);
            if (REQUIRED_REGEX.test(value)) {
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
        if (!REQUIRED_REGEX.test(template.templateName)) {
            errList.push({
                field: 'templateName',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 템플릿 등록
     * @param {object} tmp 템플릿
     */
    const saveCallback = (tmp) => {
        dispatch(
            saveTemplate({
                actions: [changeTemplate(tmp)],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`/template/${body.templateSeq}`);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 관련아이템 체크
     * @param {object} temp template
     */
    const checkRelationList = (temp) => {
        dispatch(
            hasRelationList({
                templateSeq: temp.templateSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) saveCallback(temp);
                        // 관련 아이템 있음
                        else {
                            messageBox.confirm(
                                '다른 곳에서 사용 중입니다.\n변경 시 전체 수정 반영됩니다.\n수정하시겠습니까?',
                                () => {
                                    saveCallback(temp);
                                },
                                () => {},
                            );
                        }
                    } else {
                        toast.error(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param {object} e 이벤트
     */
    const handleClickSave = (e) => {
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
                saveCallback(temp);
            } else {
                checkRelationList(temp);
            }
        }
    };

    /**
     * 템플릿 복사 모달 hide
     */
    const handleHideCopyModal = () => {
        setCopyModalData({
            title: '템플릿명',
            value: '',
            isInvalid: false,
        });
        setCopyModalShow(false);
    };

    /**
     * 템플릿 복사 모달 > 저장 버튼
     * @param {object} returnData 템플릿 복사 데이터
     */
    const handleClickCopy = (returnData) => {
        if (returnData.value.length > 0) {
            setCopyModalData({
                ...returnData,
                isInvalid: false,
            });
            dispatch(
                copyTemplate({
                    domainId: template.domain.domainId,
                    templateSeq: template.templateSeq,
                    templateName: returnData.value,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            handleHideCopyModal();
                            toast.success(header.message);
                            history.push(`/template/${body.templateSeq}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            setCopyModalData({
                ...returnData,
                isInvalid: true,
            });
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        onDelete(template);
    };

    /**
     * 취소 버튼
     */
    const handleClickCancle = () => {
        history.push('/template');
        dispatch(clearTemplate());
    };

    useEffect(() => {
        if (template.templateSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
        setTemplateNameError(false);
        imgFileRef.current.deleteFile();
    }, [template.templateSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setTemplateName(template.templateName || '');
        setCropWidth(template.cropWidth || 0);
        setCropHeight(template.cropHeight || 0);
        setDescription(template.description || '');
        setTemplateWidth(template.templateWidth || 0);
        setTemplateGroup(template.templateGroup || '');
        setTemplateThumb(template.templateThumb);
    }, [template]);

    useEffect(() => {
        if (templateThumb && templateThumb !== '') {
            setThumbSrc(`${API_BASE_URL}${UPLOAD_PATH_URL}/${templateThumb}`);
        } else {
            setThumbSrc(null);
        }
    }, [UPLOAD_PATH_URL, templateThumb]);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (templateGroup === '' && tpZoneRows.length > 0) {
            setTemplateGroup(tpZoneRows[0].dtlCd);
        }
    }, [templateGroup, tpZoneRows]);

    useEffect(() => {
        if (!tpZoneRows) dispatch(getTpZone());
    }, [dispatch, tpZoneRows]);

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
        <MokaCard titleClassName="h-100 mb-0 pb-0" title={`템플릿 ${template.templateSeq ? '정보' : '등록'}`} loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="outline-neutral" className="mr-05" disabled={btnDisabled} onClick={() => setAddComponentModalShow(true)}>
                            컴포넌트 생성
                        </Button>
                        <Button variant="outline-neutral" disabled={btnDisabled} onClick={() => setCopyModalShow(true)}>
                            복사
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="positive" className="mr-05" onClick={handleClickSave}>
                            저장
                        </Button>
                        <Button variant="negative" className="mr-05" onClick={handleClickCancle}>
                            취소
                        </Button>
                        <Button variant="negative" disabled={btnDisabled} onClick={handleClickDelete}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 템플릿ID */}
                <MokaInputLabel className="mb-2" label="템플릿ID" value={template.templateSeq} inputProps={{ plaintext: true, readOnly: true }} />
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
                    append={<MokaCopyTextButton copyText={inputTag} />}
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
                                variant="negative"
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
                    inputProps={{ width: 284, height: 280, img: thumbSrc, alt: templateName, setFileValue }}
                    className="mb-2"
                />
                {/* 설명 */}
                <MokaInputLabel label="설명" placeholder="내용설명" value={description} onChange={handleChangeValue} name="description" />
            </Form>

            {/* 템플릿복사 Modal */}
            <DefaultInputModal show={copyModalShow} onHide={handleHideCopyModal} onSave={handleClickCopy} title="템플릿 설정복사" inputData={copyModalData} />
            {/* <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} template={template} /> */}

            {/* 컴포넌트생성 Modal */}
            <AddComponentModal show={addComponentModalShow} onHide={() => setAddComponentModalShow(false)} />
        </MokaCard>
    );
};

export default TemplateEdit;
