import React, { useState } from 'react';
import produce from 'immer';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import EditDeskingPartModal from '../modals/EditDeskingPartModal';

const ComponentSelector = ({ component, areaComp, setAreaComp, compOptions, onChange, error }) => {
    const [modalShow, setModalShow] = useState(false);

    /**
     * 모달 오픈
     */
    const handleOpenModal = () => {
        setModalShow(true);
    };

    /**
     * 모달의 저장
     */
    const handleClickSave = (modalData) => {
        setAreaComp(
            produce(areaComp, (draft) => {
                draft.deskingPart = modalData.deskingPart;
            }),
        );
    };

    return (
        <React.Fragment>
            <Col xs={component.dataType === 'DESK' ? 6 : 8} className="p-0 pl-2 pr-2">
                <MokaInput as="select" name="component" value={component.componentSeq} onChange={onChange} isInvalid={error.component}>
                    <option hidden>컴포넌트를 선택하세요</option>
                    {compOptions.map((com) => (
                        <option value={com.componentSeq} key={com.componentSeq} data-datatype={com.dataType}>
                            {com.componentName}
                        </option>
                    ))}
                </MokaInput>
            </Col>
            {component.dataType === 'DESK' && (
                <Col xs={2} className="p-0 pr-2">
                    <Button variant="outline-neutral" className="p-0 w-100 h-100 ft-12" onClick={handleOpenModal} disabled={!component.componentSeq}>
                        편집파트 수정
                    </Button>
                </Col>
            )}

            {/* 편집파트 수정 모달 */}
            <EditDeskingPartModal show={modalShow} onHide={() => setModalShow(false)} areaComp={areaComp} onSave={handleClickSave} />
        </React.Fragment>
    );
};

export default ComponentSelector;
