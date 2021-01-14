import React, { useState } from 'react';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AREA_COMP_ALIGN_LEFT, AREA_COMP_ALIGN_RIGHT } from '@/constants';
import { MokaInput } from '@components';
import EditDeskingPartModal from '../modals/EditDeskingPartModal';

const AreaComp = ({ areaComp, areaComps, index, onChange, disabled, setAreaComps }) => {
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
    const handleClickSave = (areaComp) => {
        const newComps = produce(areaComps, (draft) => {
            draft.splice(index, 1, {
                ...areaComps[index],
                deskingPart: areaComp.deskingPart,
            });
        });
        setAreaComps(newComps);
    };

    return (
        <Form.Row className="mb-2" key={areaComp.component?.componentSeq}>
            <Col xs={2} className="p-0">
                <MokaInput value="컴포넌트" disabled />
            </Col>
            <Col xs={areaComp.component?.dataType === 'DESK' ? 6 : 8} className="p-0 pl-2 pr-2">
                <MokaInput value={areaComp.component?.componentName} inputProps={{ readOnly: true }} />
            </Col>
            {areaComp.component?.dataType === 'DESK' && (
                <Col xs={2} className="p-0 pr-2">
                    <Button variant="outline-neutral" className="p-0 w-100 h-100 ft-12" onClick={handleOpenModal}>
                        편집파트 수정
                    </Button>
                </Col>
            )}
            <Col xs={2} className="p-0">
                <MokaInput as="select" name="compAlign" value={areaComp.compAlign} onChange={(e) => onChange(e, index)} disabled={disabled}>
                    <option value={AREA_COMP_ALIGN_LEFT}>Left 영역</option>
                    <option value={AREA_COMP_ALIGN_RIGHT}>Right 영역</option>
                </MokaInput>
            </Col>

            {/* 편집파트 수정 모달 */}
            <EditDeskingPartModal show={modalShow} onHide={() => setModalShow(false)} areaComp={areaComp} onSave={handleClickSave} />
        </Form.Row>
    );
};

export default AreaComp;
