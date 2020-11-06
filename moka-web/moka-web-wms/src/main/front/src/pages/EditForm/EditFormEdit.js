import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { notification } from '@utils/toastUtil';
import { clearEditForm, getEditForm, saveEditForm, changeEditForm, duplicateCheck, changeInvalidList } from '@store/editForm';
import { getApi, getLang } from '@store/codeMgt';
import { MokaInput, MokaInputLabel } from '@components';
import EditFormPart from './PartList';
import PartList from './PartList';

/**
 * 편집폼 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const EditFormEdit = ({ history, onDelete }) => {
    const { formId: paramId } = useParams();
    const elLang = useRef();
    const elApiCodeId = useRef();

    // entity
    const [formId, setFormId] = useState('');
    const [formName, setEditFormName] = useState('');
    const [serviceUrl, setEditFormUrl] = useState('');
    const [usedYn, setUseYn] = useState('Y');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [description, setDescription] = useState('');

    // error
    const [formIdError, setFormIdError] = useState(false);
    const [formNameError, setEditFormNameError] = useState(false);
    const [serviceUrlError, setEditFormUrlError] = useState(false);

    // getter
    const { editForm, langRows, apiRows, invalidList } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            invalidList: store.editForm.invalidList,
        }),
        shallowEqual,
    );
    const dispatch = useDispatch();

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        if (name === 'formId') {
            const regex = /^[0-9\b]+$/;
            if ((value === '' || regex.test(value)) && value.length <= 4) {
                setFormId(value);
                setFormIdError(false);
            }
        } else if (name === 'formName') {
            setEditFormName(value);
            setEditFormNameError(false);
        } else if (name === 'serviceUrl') {
            setEditFormUrl(value);
            setEditFormUrlError(false);
        } else if (name === 'servicePlatform') {
            setServicePlatform(value);
        } else if (name === 'lang') {
            setLang(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'usedYN') {
            const usedValue = checked ? 'Y' : 'N';
            setUseYn(usedValue);
        }
    };

    /**
     * 유효성 검사를 한다.
     * @param editForm 편집폼 정보를 가진 객체
     * @returns {boolean} 유효성 검사 결과
     */
    const validate = (editForm) => {
        let isInvalid = false;
        let errList = [];

        // 편집폼아이디체크
        if (!editForm.formId || editForm.formId === '') {
            errList.push({
                field: 'formId',
                reason: '',
            });
            isInvalid = isInvalid | true;
        } else if (!/^\d{4}$/.test(editForm.formId)) {
            errList.push({
                field: 'formId',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        // 편집폼명 체크
        if (!/[^\s\t\n]+/.test(editForm.formName)) {
            errList.push({
                field: 'formName',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        // 편집폼url 체크
        if (!/[^\s\t\n]+/.test(editForm.serviceUrl)) {
            errList.push({
                field: 'serviceUrl',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        dispatch(getLang());
        dispatch(getApi());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (paramId) {
            dispatch(getEditForm(paramId));
        } else {
            dispatch(clearEditForm());
        }
    }, [dispatch, paramId]);

    useEffect(() => {
        // 편집폼 데이터 셋팅
        setFormIdError(false);
        setEditFormNameError(false);
        setEditFormUrlError(false);
        setFormId(editForm.formId || '');
        setEditFormName(editForm.formName || '');
        setServicePlatform(editForm.servicePlatform || 'P');
        setLang(editForm.lang || (elLang.current[0] ? elLang.current[0].value : ''));
        setUseYn(editForm.usedYn || 'Y');
        setEditFormUrl(editForm.serviceUrl || '');
        setDescription(editForm.description || '');
    }, [editForm]);

    /**
     * 편집폼 수정
     * @param {object} tmp 편집폼
     */
    const updateEditForm = (tmp) => {
        dispatch(
            saveEditForm({
                type: 'update',
                actions: [
                    changeEditForm({
                        ...editForm,
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    // 만약 response.header.message로 서버 메세지를 전달해준다면, 그 메세지를 보여준다.
                    if (response.header.success) {
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 편집폼 등록
     * @param {object} tmp 편집폼
     */
    const insertEditForm = (tmp) => {
        dispatch(
            duplicateCheck({
                formId,
                callback: (response) => {
                    const { body } = response;

                    if (!body) {
                        dispatch(
                            saveEditForm({
                                type: 'insert',
                                actions: [
                                    changeEditForm({
                                        ...editForm,
                                        ...tmp,
                                    }),
                                ],
                                callback: (response) => {
                                    if (response.header.success) {
                                        notification('success', '등록하였습니다.');
                                        history.push(`/editForm/${formId}`);
                                    } else {
                                        notification('warning', '실패하였습니다.');
                                    }
                                },
                            }),
                        );
                    } else {
                        console.log('hh');
                        notification('warning', '중복된 편집폼아이디가 존재합니다.');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param event 이벤트 객체
     */
    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const tmp = {
            formId,
            formName,
            servicePlatform,
            lang,
            serviceUrl,
            usedYn,
            description,
        };

        if (validate(tmp)) {
            if (paramId) {
                updateEditForm(tmp);
            } else {
                insertEditForm(tmp);
            }
        }
    };

    const handleClickDelete = () => {
        onDelete(editForm);
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'formId') {
                    setFormIdError(true);
                }
                if (i.field === 'formName') {
                    setEditFormNameError(true);
                }
                if (i.field === 'serviceUrl') {
                    setEditFormUrlError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <div className="d-flex justify-content-center mb-20">
            <Form style={{ width: 605 }}>
                {/* 사용여부 */}
                <Form.Row>
                    <Col xs={3} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="사용여부"
                            as="switch"
                            inputProps={{ label: '', checked: usedYn === 'Y' && true }}
                            id="editForm-useYN"
                            name="useYN"
                            onChange={handleChangeValue}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 편집폼ID */}
                <Form.Row>
                    <Col xs={4} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="편집폼ID"
                            placeholder="ID"
                            onChange={handleChangeValue}
                            value={formId}
                            name="formId"
                            disabled={editForm.formId && true}
                            isInvalid={formIdError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 편집폼명 */}
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="편집폼명"
                            placeholder="편집폼 명을 입력하세요"
                            onChange={handleChangeValue}
                            value={formName}
                            name="formName"
                            isInvalid={formNameError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 편집폼주소 */}
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="편집폼주소"
                            placeholder="편집폼 주소에서 http(s)://를 빼고 입력하세요"
                            onChange={handleChangeValue}
                            value={serviceUrl}
                            name="serviceUrl"
                            isInvalid={serviceUrlError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 플랫폼 */}
                <Form.Row>
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            label="플랫폼"
                            as="radio"
                            inputProps={{
                                custom: true,
                                label: 'PC',
                                checked: servicePlatform === 'P' && true,
                            }}
                            id="editForm-pc"
                            name="servicePlatform"
                            onChange={handleChangeValue}
                            value="P"
                            className="mb-0 h-100"
                            required
                        />
                    </Col>
                    <Col xs={1} className="p-0 mr-10">
                        <MokaInput
                            inputProps={{ custom: true, label: 'Mobile', checked: servicePlatform === 'M' && true }}
                            id="editForm-mobile"
                            as="radio"
                            value="M"
                            name="servicePlatform"
                            className="mb-0 h-100 align-items-center d-flex"
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* 언어 */}
                <Form.Row>
                    <Col xs={4} className="pl-0 ml-0 pr-0 pl-0">
                        <MokaInputLabel as="select" label="언어" className="pt-1 mr-0 pr-0 pl-0" onChange={handleChangeValue} value={lang} name="lang" inputProps={{ ref: elLang }}>
                            {langRows &&
                                langRows.map((row) => (
                                    <option key={row.id} value={row.dtlCd}>
                                        {row.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 메모 */}
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel as="textarea" label="매모" inputProps={{ rows: 3 }} onChange={handleChangeValue} value={description} name="description" />
                    </Col>
                </Form.Row>
                {/* 버튼 */}
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="primary" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button className="float-left mr-10 pr-20 pl-20" variant="gray150">
                        취소
                    </Button>
                    {paramId && (
                        <Button className="float-left mr-0 pr-20 pl-20" variant="gray150" onClick={handleClickDelete}>
                            삭제
                        </Button>
                    )}
                </Form.Group>
            </Form>
            <PartList formData={editForm}></PartList>
        </div>
    );
};

export default withRouter(EditFormEdit);
