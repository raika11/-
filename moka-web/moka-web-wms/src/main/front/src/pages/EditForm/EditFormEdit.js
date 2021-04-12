import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { clearEditForm, exportEditFormXml, getEditForm, showFormXmlImportModal, showHistoryModal, showPublishModal } from '@store/editForm';
import { getApi, getLang } from '@store/codeMgt';
import { MokaCard, MokaInputLabel } from '@components';
import PartList from './PartList';
import { CARD_DEFAULT_HEIGHT } from '@/style_constants';
import { Card } from 'react-bootstrap';
import EditFormPartPublishModal from './EditFormPartPublishModal';
import EditFormPartHistoryModal from './EditFormPartHistoryModal';

/**
 * 편집폼 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */

const EditFormEdit = ({ history, onDelete }) => {
    const { formId: paramId } = useParams();

    // entity
    const [formId, setFormId] = useState('');
    const [formName, setEditFormName] = useState('');
    const [serviceUrl, setEditFormUrl] = useState('');
    const [usedYn, setUseYn] = useState('Y');
    const [, setServicePlatform] = useState('P');
    const [, setLang] = useState('KR');
    const [, setDescription] = useState('');

    // error
    const [formIdError, setFormIdError] = useState(false);
    const [formNameError, setEditFormNameError] = useState(false);
    const [serviceUrlError, setEditFormUrlError] = useState(false);

    // getter
    const { editForm, editFormParts, invalidList, publishModalShow, historyModalShow } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            editFormParts: store.editForm.editFormParts,
            editFormPart: store.editForm.editFormPart,
            invalidList: store.editForm.invalidList,
            publishModalShow: store.editForm.publishModalShow,
            historyModalShow: store.editForm.historyModalShow,
        }),
        shallowEqual,
    );
    const dispatch = useDispatch();

    const hidePublishModal = () => {
        dispatch(showPublishModal(false));
    };

    const hideHistoryModal = () => {
        dispatch(showHistoryModal(false));
    };

    const handleClickExport = () => {
        dispatch(exportEditFormXml(editForm.formSeq));
    };

    const handleClickImport = () => {
        dispatch(showFormXmlImportModal(true, { formSeq: editForm.formSeq, title: editForm.formName }));
    };

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
    // const validate = (editForm) => {
    //     let isInvalid = false;
    //     let errList = [];

    //     // 편집폼아이디체크
    //     if (!editForm.formId || editForm.formId === '') {
    //         errList.push({
    //             field: 'formId',
    //             reason: '',
    //         });
    //         isInvalid = isInvalid | true;
    //     } else if (!/^\d{4}$/.test(editForm.formId)) {
    //         errList.push({
    //             field: 'formId',
    //             reason: '',
    //         });
    //         isInvalid = isInvalid | true;
    //     }

    //     // 편집폼명 체크
    //     if (!/[^\s\t\n]+/.test(editForm.formName)) {
    //         errList.push({
    //             field: 'formName',
    //             reason: '',
    //         });
    //         isInvalid = isInvalid | true;
    //     }

    //     // 편집폼url 체크
    //     if (!/[^\s\t\n]+/.test(editForm.serviceUrl)) {
    //         errList.push({
    //             field: 'serviceUrl',
    //             reason: '',
    //         });
    //         isInvalid = isInvalid | true;
    //     }

    //     dispatch(changeInvalidList(errList));
    //     return !isInvalid;
    // };

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
        setUseYn(editForm.usedYn || 'Y');
        setEditFormUrl(editForm.serviceUrl || '');
        setDescription(editForm.description || '');
    }, [editForm, editFormParts, setDescription]);

    const handleClickDelete = () => {
        onDelete(editForm);
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList && invalidList.length > 0) {
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
        <div className="flex-fill">
            <Row>
                <Col xs={5}>
                    <MokaCard className="w-100" height={CARD_DEFAULT_HEIGHT - 90}>
                        <Form>
                            {/* 사용여부 */}
                            <Form.Row>
                                <Col xs={3} className="pl-0 pr-0">
                                    <MokaInputLabel
                                        label="사용여부"
                                        as="switch"
                                        inputProps={{
                                            label: '',
                                            checked: usedYn === 'Y' && true,
                                        }}
                                        id="editForm-useYN"
                                        name="useYN"
                                        onChange={handleChangeValue}
                                        required
                                    />
                                </Col>
                            </Form.Row>

                            {/* 편집폼ID */}
                            <Form.Row>
                                <Col xs={12} className="pl-0 pr-0">
                                    <MokaInputLabel
                                        label="편집폼ID"
                                        placeholder="ID"
                                        onChange={handleChangeValue}
                                        value={formId}
                                        name="formId"
                                        disabled={editForm.formId && true}
                                        isInvalid={formIdError}
                                        required
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                </Col>
                            </Form.Row>

                            {/* 편집폼명 */}
                            <Form.Row>
                                <Col xs={12} className="pl-0 pr-0">
                                    <MokaInputLabel
                                        label="편집폼명"
                                        placeholder="편집폼 명을 입력하세요"
                                        onChange={handleChangeValue}
                                        value={formName}
                                        name="formName"
                                        isInvalid={formNameError}
                                        required
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                </Col>
                            </Form.Row>

                            {/* 편집폼주소 */}
                            <Form.Row>
                                <Col xs={12} className="pl-0 pr-0">
                                    <MokaInputLabel
                                        label="서비스URL"
                                        placeholder="편집폼 주소에서 http(s)://를 빼고 입력하세요"
                                        onChange={handleChangeValue}
                                        value={serviceUrl}
                                        name="serviceUrl"
                                        isInvalid={serviceUrlError}
                                        required
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                </Col>
                            </Form.Row>

                            {/* 버튼 */}
                            {paramId && (
                                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                                    <Button className="float-left mr-10 pr-20 pl-20" variant="positive" title="XML Export" onClick={handleClickImport}>
                                        Import
                                    </Button>
                                    <Button className="float-left mr-10 pr-20 pl-20" variant="negative" title="XML Export" onClick={handleClickExport}>
                                        Export
                                    </Button>
                                    <Button className="float-left mr-0 pr-20 pl-20" variant="negative" onClick={handleClickDelete} title="삭제">
                                        삭제
                                    </Button>
                                </Form.Group>
                            )}
                        </Form>
                    </MokaCard>
                </Col>
                <Col xs={7}>
                    <Card className="w-100">
                        <Card.Body style={{ overflowY: 'auto', height: CARD_DEFAULT_HEIGHT - 120 }}>
                            <PartList></PartList>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <EditFormPartPublishModal show={publishModalShow} onHide={() => hidePublishModal()} />
            <EditFormPartHistoryModal show={historyModalShow} onHide={() => hideHistoryModal()} />
        </div>
    );
};

export default withRouter(EditFormEdit);
