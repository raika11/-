import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { DATA_TYPE_AUTO, DATA_TYPE_DESK, DATA_TYPE_NONE } from '@/constants';
import { MokaInput, MokaInputLabel, MokaInputGroup, MokaIcon, MokaPrependLinkInput, MokaCopyTextButton } from '@components';
import { DatasetListModal } from '@pages/Dataset/modals';
import { TemplateListModal } from '@pages/Template/modals';
// import { EditFormPartListModal } from '@pages/EditForm/modals';

/**
 * 노출여부 설명하는 popover
 */
const popover = (
    <Popover id="popover-component-info">
        <Popover.Title>노출여부 (viewYn)</Popover.Title>
        <Popover.Content>
            편집 컴포넌트는 등록 시 자동으로 viewYn이 N으로 설정되어 페이지에 추가되어도 보이지 않습니다. (페이지편집에서만 영역 활성으로 변경 가능)
            <br />
            다만 <strong>예외적으로 Y로 등록해야할 경우 Y로 변경하여 등록하세요.</strong> <br />
            (ex. 네이버스탠드, 네이버채널 페이지에 새로운 컴포넌트 추가)
        </Popover.Content>
    </Popover>
);

/**
 * 컴포넌트 > 템플릿, 데이터셋, 입력태그, 삭제 단어
 * 편집폼 관련 소스 주석 처리
 */
const DetailRelationForm = (props) => {
    const { addMode, component, setComponent, inputTag, error, setError } = props;
    const [templateModalShow, setTemplateModalShow] = useState(false);
    const [datasetModalShow, setDatasetModalShow] = useState(false);
    // const [formModalShow, setFormModalShow] = useState(false);
    const [dataset, setDataset] = useState({});
    const [template, setTemplate] = useState({});
    // const [editFormPart, setEditFormPart] = useState({});

    /**
     * input 값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'dataType') {
            // 데이터 on => 기존 데이터셋의 dataType을 셋팅한다
            const originType = component?.dataset?.autoCreateYn === 'Y' ? DATA_TYPE_AUTO : DATA_TYPE_DESK;
            setComponent({
                ...component,
                dataType: checked ? originType : DATA_TYPE_NONE,
            });
        } else {
            setComponent({
                ...component,
                [name]: value,
            });
        }
    };

    /**
     * 데이터셋 변경
     */
    const handleChangeDataset = (e) => {
        const { value } = e.target;
        let result = { dataType: value };
        // 편집 <=> 자동 변경 불가능하게 변경됨
        // if (value === DATA_TYPE_AUTO) {
        //     if (component.prevAutoDataset) {
        //         result.dataset = component.prevAutoDataset;
        //     } else {
        //         result.dataset = {};
        //     }
        //     result.editFormPart = {};
        // } else if (value === DATA_TYPE_DESK) {
        //     if (component.prevDeskDataset) {
        //         result.dataset = component.prevDeskDataset;
        //     } else {
        //         result.dataset = {};
        //     }
        //     result.editFormPart = {};
        // } else if (value === DATA_TYPE_FORM) {
        //     result.dataset = {};
        // }
        setComponent({ ...component, ...result });
    };

    useEffect(() => {
        if (component.dataset) setDataset(component.dataset);
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

            {/* 데이터셋 */}
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        label="데이터"
                        as="switch"
                        className="mb-0 h-100"
                        id="data-type-check"
                        name="dataType"
                        inputProps={{ checked: component.dataType !== DATA_TYPE_NONE }}
                        onChange={handleChangeValue}
                    />
                </Col>
                {component.dataType !== DATA_TYPE_NONE && (
                    <React.Fragment>
                        {/* 자동/편집/폼 셀렉트 => 등록 시에만 선택 가능!!! */}
                        <Col xs={2} className="d-flex p-0 pr-2">
                            <MokaInput as="select" value={component.dataType} onChange={handleChangeDataset} disabled={!addMode}>
                                <option value={DATA_TYPE_DESK}>편집</option>
                                <option value={DATA_TYPE_AUTO}>자동</option>
                                {/* <option value="FORM">폼</option> */}
                            </MokaInput>
                        </Col>

                        {/* 자동/편집/폼에 따른 input */}
                        <Col xs={7} className="p-0">
                            {component.dataType === DATA_TYPE_DESK && (
                                <div className="d-flex">
                                    {/* 편집 데이터셋 ID 노출 */}
                                    <MokaInput placeholder="ID" className="flex-fill" value={component.prevDeskDataset ? component.prevDeskDataset.datasetSeq : ''} disabled />

                                    {/* viewYn 설정 => 등록 시에만 설정할 수 있음!!!! */}
                                    {addMode && (
                                        <div className="flex-shrink-0 ml-2" style={{ width: 150 }}>
                                            <MokaInputLabel
                                                as="select"
                                                label={
                                                    <React.Fragment>
                                                        노출여부
                                                        <OverlayTrigger overlay={popover} trigger={['click']}>
                                                            <MokaIcon iconName="fas-info-circle" className="ml-1 color-info cursor-pointer" />
                                                        </OverlayTrigger>
                                                    </React.Fragment>
                                                }
                                                name="viewYn"
                                                value={component.viewYn}
                                                onChange={handleChangeValue}
                                            >
                                                <option value="Y">Y</option>
                                                <option value="N">N</option>
                                            </MokaInputLabel>
                                        </div>
                                    )}
                                </div>
                            )}
                            {component.dataType === DATA_TYPE_AUTO && (
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
                                    isInvalid={error.dataset}
                                />
                            )}
                            {/* {component.dataType === DATA_TYPE_FORM && (
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
                            )} */}
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
                    setComponent({ ...component, template });
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
                onClickSave={(dataset) => {
                    setComponent({ ...component, dataset });
                    if (dataset.datasetSeq) {
                        setError({ ...error, dataset: false });
                    }
                }}
                selected={dataset.datasetSeq}
                exclude={component.prevDeskDataset ? component.prevDeskDataset.datasetSeq : undefined}
            />

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
