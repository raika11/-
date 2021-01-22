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
            <div className="flex-shrink-0 mr-2" style={{ width: 86 }}>
                <MokaInput value="컴포넌트" className="ft-13" disabled />
            </div>
            <MokaInput value={areaComp.component?.componentName} inputProps={{ readOnly: true }} />
            {areaComp.component?.dataType === 'DESK' && (
                <Button variant="outline-neutral" className="ft-12 ml-2 flex-shrink-0" onClick={handleOpenModal}>
                    편집파트 수정
                </Button>
            )}
            <div className="ml-2 flex-shrink-0">
                <MokaInput as="select" name="compAlign" className="ft-13" value={areaComp.compAlign} onChange={(e) => onChange(e, index)} disabled={disabled}>
                    <option value={AREA_COMP_ALIGN_LEFT}>Left 영역</option>
                    <option value={AREA_COMP_ALIGN_RIGHT}>Right 영역</option>
                </MokaInput>
            </div>

            {/* 편집파트 수정 모달 */}
            <EditDeskingPartModal show={modalShow} onHide={() => setModalShow(false)} areaComp={areaComp} onSave={handleClickSave} />
        </Form.Row>
    );
};

export default AreaComp;
