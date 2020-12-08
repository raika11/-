import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaInput, MokaInputLabel, MokaInputGroup, MokaIcon, MokaPrependLinkInput, MokaCopyTextButton } from '@components';
import { DatasetListModal } from '@pages/Dataset/modals';
import { TemplateListModal } from '@pages/Template/modals';
import { EditFormPartListModal } from '@pages/EditForm/modals';

const DetailRelationForm = (props) => {
    const { component, setComponent, inputTag, error, setError } = props;

    // state
    const [templateModalShow, setTemplateModalShow] = useState(false);
    const [datasetModalShow, setDatasetModalShow] = useState(false);
    const [formModalShow, setFormModalShow] = useState(false);

    const [dataset, setDataset] = useState({});
    const [template, setTemplate] = useState({});
    const [editFormPart, setEditFormPart] = useState({});

    /**
     * input 값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'dataType') {
            setComponent({
                ...component,
                dataType: checked ? 'DESK' : 'NONE',
            });
        } else if (name === 'delWords') {
            setComponent({
                ...component,
                delWords: value,
            });
        } else if (name === 'zone') {
            setComponent({
                ...component,
                zone: value,
            });
        } else if (name === 'matchZone') {
            setComponent({
                ...component,
                matchZone: value,
            });
        }
    };

    /**
     * 데이터셋 변경
     */
    const handleChangeDataset = (e) => {
        const { value } = e.target;
        let result = { dataType: value };
        if (value === 'AUTO') {
            if (component.prevAutoDataset) {
                result.dataset = component.prevAutoDataset;
            } else {
                result.dataset = {};
            }
            result.editFormPart = {};
        } else if (value === 'DESK') {
            if (component.prevDeskDataset) {
                result.dataset = component.prevDeskDataset;
            } else {
                result.dataset = {};
            }
            result.editFormPart = {};
        } else if (value === 'FORM') {
            result.dataset = {};
        }
        setComponent({ ...component, ...result });
    };

    useEffect(() => {
        if (component.dataset) {
            setDataset(component.dataset);
        }
        if (component.template) {
            setTemplate(component.template);
        }
        setEditFormPart(component.editFormPart || {});
    }, [component]);

    return (
        <Form>
            {/* 템플릿 */}
            <MokaInputGroup
                className="mb-2"
                label="템플릿"
                as="prependLink"
                inputProps={{
                    to: template.templateSeq ? `/template/${template.templateSeq}` : undefined,
                    linkText: template.templateSeq ? `ID: ${template.templateSeq}` : 'ID',
                    inputList: [
                        {
                            value: template.templateGroupName,
                            disabled: true,
                            style: { width: 175 },
                            className: 'bg-white flex-grow-0',
                            placeholder: '템플릿 위치그룹',
                        },
                        {
                            value: template.templateName,
                            disabled: true,
                            className: 'flex-fill bg-white',
                            placeholder: '템플릿을 선택하세요',
                        },
                    ],
                    icon: <MokaIcon iconName="fal-search" />,
                    onIconClick: () => setTemplateModalShow(true),
                }}
                isInvalid={error.template}
                required
            />
            {/* 데이터셋 */}
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        label="데이터"
                        as="switch"
                        className="mb-0 h-100"
                        id="data-type-check"
                        name="dataType"
                        inputProps={{ checked: component.dataType !== 'NONE' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                {component.dataType !== 'NONE' && (
                    <React.Fragment>
                        {/* 자동/편집/폼 셀렉트 */}
                        <Col xs={2} className="d-flex p-0 pr-3">
                            <MokaInput as="select" value={component.dataType} onChange={handleChangeDataset}>
                                <option value="DESK">편집</option>
                                <option value="AUTO">자동</option>
                                {/* <option value="FORM">폼</option> */}
                            </MokaInput>
                        </Col>

                        {/* 자동/편집/폼에 따른 input */}
                        <Col xs={7} className="p-0">
                            {component.dataType === 'DESK' && <MokaInput placeholder="ID" value={component.prevDeskDataset ? component.prevDeskDataset.datasetSeq : ''} disabled />}
                            {component.dataType === 'AUTO' && (
                                <MokaPrependLinkInput
                                    to={dataset.datasetSeq ? `/dataset/${dataset.datasetSeq}` : undefined}
                                    linkText={dataset.datasetSeq ? `ID: ${dataset.datasetSeq}` : 'ID'}
                                    inputList={{
                                        placeholder: '데이터셋 선택',
                                        className: 'bg-white',
                                        value: dataset.datasetName,
                                        disabled: true,
                                    }}
                                    icon={<MokaIcon iconName="fal-search" />}
                                    // 아이콘 클릭했을 때 데이터셋 팝업 열고, 데이터셋 선택하면 화면에 보여줌
                                    onIconClick={() => setDatasetModalShow(true)}
                                />
                            )}
                            {component.dataType === 'FORM' && (
                                <MokaPrependLinkInput
                                    to={editFormPart.partSeq ? `/edit-form/${editFormPart.formSeq}` : undefined}
                                    linkText={editFormPart.partSeq ? `ID: ${editFormPart.partSeq}` : 'ID'}
                                    inputList={{
                                        placeholder: '폼 선택',
                                        className: 'bg-white',
                                        value: editFormPart.partTitle,
                                        disabled: true,
                                    }}
                                    icon={<MokaIcon iconName="fal-search" />}
                                    // 아이콘 클릭했을 때 데이터셋 팝업 열고, 데이터셋 선택하면 화면에 보여줌
                                    onIconClick={() => setFormModalShow(true)}
                                />
                            )}
                        </Col>
                    </React.Fragment>
                )}
            </Form.Row>
            {/* 입력태그 */}
            <MokaInputGroup label="입력태그" value={inputTag} className="mb-2" append={<MokaCopyTextButton copyText={inputTag} />} disabled />
            {/* 삭제 단어 */}
            <MokaInputLabel
                label={
                    <React.Fragment>
                        삭제 단어
                        <br />
                        (제목)
                    </React.Fragment>
                }
                as="textarea"
                className="mb-2"
                name="delWords"
                inputClassName="resize-none"
                inputProps={{ rows: 4 }}
                value={component.delWords}
                onChange={handleChangeValue}
            />
            {/* 영역 설정 -> 사용X */}
            {/* <Form.Row className="mb-2">
                <Col xs={4} className="p-0">
                    <MokaInputLabel label="매칭영역" className="mb-0" value={component.matchZone} name="matchZone" onChange={handleChangeValue} />
                </Col>
                <Col xs={8} className="p-0">
                    <MokaInputLabel label="영역 목록" className="mb-0" value={component.zone} name="zone" onChange={handleChangeValue} />
                </Col>
            </Form.Row> */}

            {/* 템플릿 선택 팝업 */}
            <TemplateListModal
                show={templateModalShow}
                onHide={() => setTemplateModalShow(false)}
                onClickSave={(template) => {
                    setComponent({
                        ...component,
                        template,
                    });
                    if (template.templateSeq) {
                        setError({ ...error, template: false });
                    }
                }}
                selected={template.templateSeq}
            />

            {/* 데이터셋 선택 팝업 */}
            <DatasetListModal
                show={datasetModalShow}
                onHide={() => setDatasetModalShow(false)}
                onClickSave={(dataset) => setComponent({ ...component, dataset })}
                selected={dataset.datasetSeq}
                exclude={component.prevDeskDataset ? component.prevDeskDataset.datasetSeq : undefined}
            />

            {/* 폼 선택 팝업 */}
            <EditFormPartListModal
                show={formModalShow}
                onHide={() => setFormModalShow(false)}
                onClickSave={(editFormPart) => setComponent({ ...component, editFormPart })}
                selected={editFormPart.partSeq}
            />
        </Form>
    );
};

export default DetailRelationForm;
