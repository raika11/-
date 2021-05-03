import React, { useState, useEffect } from 'react';
import { MokaInputLabel, MokaInputGroup, MokaIcon, MokaCopyTextButton } from '@components';
import DetailDatasetForm from './DetailDatasetForm';
import { TemplateListModal } from '@pages/Template/modals';
// import { EditFormPartListModal } from '@pages/EditForm/modals';

/**
 * 컴포넌트 > 템플릿, 데이터셋, 입력태그, 삭제 단어
 * 편집폼 관련 소스 주석 처리
 */
const DetailRelationForm = ({ addMode, origin, component, setComponent, inputTag, error, setError }) => {
    const [templateModalShow, setTemplateModalShow] = useState(false);
    // const [formModalShow, setFormModalShow] = useState(false);
    const [template, setTemplate] = useState({});
    // const [editFormPart, setEditFormPart] = useState({});

    /**
     * input 값 변경
     */
    const handleChangeValue = (e) =>
        setComponent({
            ...component,
            [e.target.name]: e.target.value,
        });

    useEffect(() => {
        if (component.template) setTemplate(component.template);
        // setEditFormPart(component.editFormPart || {});
    }, [component]);

    return (
        <div>
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

            {/* 템플릿 선택 팝업 */}
            <TemplateListModal
                show={templateModalShow}
                onHide={() => setTemplateModalShow(false)}
                onClickSave={(template) => {
                    setComponent({ ...component, template });
                    if (template.templateSeq) {
                        setError({ ...error, template: false });
                    }
                }}
                selected={template.templateSeq}
            />

            {/* 데이터셋 */}
            <DetailDatasetForm className="mb-2" component={component} setComponent={setComponent} origin={origin} error={error} setError={setError} addMode={addMode} />

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

            {/* 폼 선택 팝업 */}
            {/* <EditFormPartListModal
                show={formModalShow}
                onHide={() => setFormModalShow(false)}
                onClickSave={(editFormPart) => setComponent({ ...component, editFormPart })}
                selected={editFormPart.partSeq}
            /> */}
        </div>
    );
};

export default DetailRelationForm;
