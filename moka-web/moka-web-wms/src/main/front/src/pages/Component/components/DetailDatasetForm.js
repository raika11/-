import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { DATA_TYPE_AUTO, DATA_TYPE_DESK, DATA_TYPE_NONE } from '@/constants';
import { MokaInputLabel, MokaInput, MokaIcon, MokaPrependLinkInput } from '@components';
import { DatasetListModal } from '@pages/Dataset/modals';

/**
 * 노출여부 설명하는 popover
 */
const popover = (id) => (
    <Popover id={`popover-component-info-${id}`}>
        <Popover.Title>노출여부 (viewYn)</Popover.Title>
        <Popover.Content>
            편집 컴포넌트는 등록 시 자동으로 viewYn이 N으로 설정되어 페이지에 추가되어도 보이지 않습니다. (페이지편집에서만 영역 활성으로 변경 가능)
            <br />
            다만 <strong>예외적으로 Y로 등록해야할 경우 Y로 변경하여 등록하세요.</strong> <br />
            (ex. 네이버스탠드, 네이버채널 페이지에 새로운 컴포넌트 추가)
        </Popover.Content>
    </Popover>
);

const defaultProps = {
    component: {},
    addMode: true,
    error: {},
    id: '0',
};

/**
 * 데이터셋 수정폼
 */
const DetailDatasetForm = ({ className, component, setComponent, origin, addMode, error, setError, id }) => {
    const [dataset, setDataset] = useState({});
    const [datasetModalShow, setDatasetModalShow] = useState(false);
    const [popoverInfo] = useState(popover(id));

    /**
     * input 값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'dataType') {
            const newDataType = checked ? (!origin?.dataType || origin?.dataType === DATA_TYPE_NONE ? DATA_TYPE_DESK : origin?.dataType) : DATA_TYPE_NONE;

            // 데이터 on => 기존 데이터셋의 dataType을 셋팅한다
            setComponent({
                ...component,
                dataType: newDataType,
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
        setDataset(component.dataset || {});
    }, [component]);

    return (
        <Form.Row className={className}>
            <Col xs={3} className="p-0">
                <MokaInputLabel
                    label="데이터"
                    as="switch"
                    className="mb-0 h-100"
                    id={`data-type-check-${id}`}
                    name="dataType"
                    inputProps={{ checked: component.dataType !== DATA_TYPE_NONE }}
                    onChange={handleChangeValue}
                    disabled={!addMode}
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
                                <MokaInput placeholder="ID" className="flex-fill" value={origin?.dataset ? origin?.dataset?.datasetSeq : ''} disabled />

                                {/* viewYn 설정 => 등록 시에만 설정할 수 있음!!!! */}
                                {addMode && (
                                    <div className="flex-shrink-0 ml-2" style={{ width: 150 }}>
                                        <MokaInputLabel
                                            as="select"
                                            label={
                                                <React.Fragment>
                                                    노출여부
                                                    <OverlayTrigger overlay={popoverInfo} trigger={['click']}>
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
                                to={dataset?.datasetSeq ? `/dataset/${dataset?.datasetSeq}` : undefined}
                                linkText={dataset?.datasetSeq ? `ID: ${dataset?.datasetSeq}` : 'ID'}
                                inputList={{
                                    placeholder: '데이터셋 선택',
                                    className: 'bg-white',
                                    value: dataset?.datasetName,
                                    disabled: true,
                                }}
                                icon={<MokaIcon iconName="fal-search" />}
                                // 아이콘 클릭했을 때 데이터셋 팝업 열고, 데이터셋 선택하면 화면에 보여줌
                                onIconClick={() => setDatasetModalShow(true)}
                                isInvalid={error.dataset}
                            />
                        )}
                        {/* 데이터셋 선택 팝업 */}
                        <DatasetListModal
                            show={datasetModalShow}
                            onHide={() => setDatasetModalShow(false)}
                            onClickSave={(dataset) => {
                                setComponent({ ...component, dataset });
                                if (dataset?.datasetSeq) {
                                    setError({ ...error, dataset: false });
                                }
                            }}
                            id={String(id)}
                            selected={dataset?.datasetSeq}
                            exclude={component.prevDeskDataset ? component.prevDeskdataset?.datasetSeq : undefined}
                        />
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
    );
};

DetailDatasetForm.defaultProps = defaultProps;

export default DetailDatasetForm;
