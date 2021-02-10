import React, { useState } from 'react';
import produce from 'immer';
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
            <MokaInput as="select" name="component" value={component.componentSeq} onChange={onChange} isInvalid={error.component} invalidMessage={error.componentMessage}>
                <option hidden>컴포넌트를 선택하세요</option>
                {compOptions.map((com) => (
                    <option value={com.componentSeq} key={com.componentSeq} data-datatype={com.dataType}>
                        {com.componentName}
                    </option>
                ))}
            </MokaInput>
            {component.dataType === 'DESK' && (
                <Button variant="outline-neutral" className="ml-2 flex-shrink-0" onClick={handleOpenModal} disabled={!component.componentSeq}>
                    편집파트 수정
                </Button>
            )}

            {/* 편집파트 수정 모달 */}
            <EditDeskingPartModal show={modalShow} onHide={() => setModalShow(false)} areaComp={areaComp} onSave={handleClickSave} />
        </React.Fragment>
    );
};

export default ComponentSelector;
