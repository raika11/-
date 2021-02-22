import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { MokaCard, MokaInputLabel, MokaInput, MokaInputGroup, MokaCopyTextButton } from '@components';
import { changeTemplate, saveTemplate, changeInvalidList, hasRelationList, GET_TEMPLATE, DELETE_TEMPLATE, SAVE_TEMPLATE } from '@store/template';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import CopyModal from './modals/CopyModal';
import AddComponentModal from './modals/AddComponentModal';

/**
 * 템플릿 등록/수정 컴포넌트
 */
const TemplateEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector((store) => store.loading[GET_TEMPLATE] || store.loading[DELETE_TEMPLATE] || store.loading[SAVE_TEMPLATE]);
    const UPLOAD_PATH_URL = useSelector((store) => store.app.UPLOAD_PATH_URL);
    const tpZoneRows = useSelector((store) => store.codeMgt.tpZoneRows);
    const latestDomainId = useSelector((store) => store.auth.latestDomainId);
    const { template, inputTag, invalidList } = useSelector(({ template }) => template);

    // state
    const [temp, setTemp] = useState({});
    const [thumbSrc, setThumbSrc] = useState();
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [error, setError] = useState({});
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [addComponentModalShow, setAddComponentModalShow] = useState(false);
    const imgFileRef = useRef(null);

    /**
     * 입력값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'templateName') {
            if (REQUIRED_REGEX.test(value)) {
                setError({ ...error, templateName: false });
            }
        }

        setTemp({ ...temp, [name]: value });
    };

    /**
     * 이미지 파일 변경
     */
    const setFileValue = (data) => {
        setTemp({
            ...temp,
            templateThumbnailFile: data,
        });
    };

    /**
     * 유효성 검사
     * @param {object} template 템플릿데이터
     */
    const validate = (template) => {
        let isInvalid = false;
        let errList = [];

        // 템플릿명 체크
        if (!template.templateName || !REQUIRED_REGEX.test(template.templateName)) {
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
                        history.push(`${match.path}/${body.templateSeq}`);
                    } else {
                        if (body?.list) {
                            const bodyChk = body.list.filter((e) => e.field === 'templateBody');
                            if (bodyChk.length > 0) {
                                messageBox.alert('Tems 문법 사용이 비정상적으로 사용되었습니다\n수정 확인후 다시 저장해 주세요', () => {});
                                return;
                            }
                        }
                        messageBox.alert(header.message);
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
     * 삭제 버튼
     */
    const handleClickDelete = () => onDelete(template);

    /**
     * 취소 버튼
     */
    const handleClickCancle = () => history.push(match.path);

    useEffect(() => {
        if (template.templateSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
        setError({});
        imgFileRef.current.deleteFile();
    }, [template.templateSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setTemp({
            ...template,
            cropWidth: template.cropWidth || 0,
            cropHeight: template.cropHeight || 0,
            templateWidth: template.templateWidth || 0,
        });
        if (template.templateThumb && template.templateThumb !== '') {
            setThumbSrc(`${API_BASE_URL}${UPLOAD_PATH_URL}/${template.templateThumb}`);
        } else {
            setThumbSrc(null);
        }
    }, [UPLOAD_PATH_URL, template]);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (temp.templateGroup === '' && tpZoneRows && tpZoneRows.length > 0) {
            setTemp({ ...temp, templateGroup: tpZoneRows[0].dtlCd });
        }
    }, [temp, tpZoneRows]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title={`템플릿 ${template.templateSeq ? '수정' : '등록'}`} loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div>
                        <Button variant="outline-neutral" className="mr-1" disabled={btnDisabled} onClick={() => setAddComponentModalShow(true)}>
                            컴포넌트 생성
                        </Button>

                        {/* 컴포넌트생성 Modal */}
                        <AddComponentModal show={addComponentModalShow} onHide={() => setAddComponentModalShow(false)} />

                        <Button variant="outline-neutral" disabled={btnDisabled} onClick={() => setCopyModalShow(true)}>
                            복사
                        </Button>

                        {/* 템플릿복사 Modal */}
                        <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} template={template} />
                    </div>
                    <div>
                        <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                            {btnDisabled ? '저장' : '수정'}
                        </Button>
                        {!btnDisabled && (
                            <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                                삭제
                            </Button>
                        )}
                        <Button variant="negative" onClick={handleClickCancle}>
                            취소
                        </Button>
                    </div>
                </Form.Group>

                {/* 템플릿ID */}
                <MokaInputLabel className="mb-2" label="템플릿ID" value={template.templateSeq} inputProps={{ plaintext: true, readOnly: true }} />

                {/* 템플릿명 */}
                <MokaInputLabel
                    className="mb-2"
                    label="템플릿명"
                    value={temp.templateName}
                    name="templateName"
                    onChange={handleChangeValue}
                    placeholder="템플릿명을 입력하세요"
                    isInvalid={error.templateName}
                    required
                />

                {/* 위치그룹 */}
                <MokaInputLabel className="mb-2" label="위치 그룹" as="select" value={temp.templateGroup} onChange={handleChangeValue} name="templateGroup">
                    {tpZoneRows &&
                        tpZoneRows.map((cd) => (
                            <option key={cd.dtlCd} value={cd.dtlCd}>
                                {cd.cdNm}
                            </option>
                        ))}
                </MokaInputLabel>

                {/* 사이즈, 이미지 크기 */}
                <Row className="m-0 mb-2">
                    <Col xs={5} className="p-0 m-0">
                        <MokaInputLabel className="mb-0" label="사이즈" value={temp.templateWidth} onChange={handleChangeValue} type="number" name="templateWidth" />
                    </Col>
                    <Col xs={4} className="p-0 pl-2">
                        <MokaInputLabel
                            label="이미지"
                            labelWidth={36}
                            labelClassName="mr-2"
                            className="mb-0"
                            value={temp.cropWidth}
                            name="cropWidth"
                            onChange={handleChangeValue}
                            type="number"
                        />
                    </Col>
                    <Col xs={3} className="d-flex align-items-center p-0 pl-2">
                        x <MokaInput className="ml-2 mb-0 ft-12" value={temp.cropHeight} onChange={handleChangeValue} type="number" name="cropHeight" />{' '}
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
                            <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => imgFileRef.current.rootRef.onClick(e)}>
                                신규등록
                            </Button>
                        </>
                    }
                    inputProps={{ width: 284, height: (284 * 9) / 16, img: thumbSrc, alt: temp.templateName, deleteButton: true, setFileValue }}
                    className="mb-2"
                />

                {/* 설명 */}
                <MokaInputLabel label="설명" placeholder="내용설명" value={temp.description} onChange={handleChangeValue} name="description" />
            </Form>
        </MokaCard>
    );
};

export default TemplateEdit;
