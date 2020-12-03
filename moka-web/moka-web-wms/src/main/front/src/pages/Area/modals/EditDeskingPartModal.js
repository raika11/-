import React, { useState } from 'react';
import { MokaModal, MokaInput } from '@components';

/**
 * 편집파트 변경 모달
 */
const EditDeskingPartModal = (props) => {
    const { show, onHide, areaComp, onSave } = props;

    const [value, setValue] = useState(areaComp?.deskingPart);

    const handleClickSave = () => {
        if (typeof onSave === 'function') {
            onSave({ ...areaComp, deskingPart: value });
        }
        onHide();
    };

    const handleClickCancle = () => {
        setValue(areaComp?.deskingPart);
        onHide();
    };

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="편집파트 수정"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            footerClassName="d-flex align-items-center justify-content-center"
            draggable
            centered
        >
            <MokaInput as="checkbox" name="title" id="title" inputProps={{ label: '제목', custom: true }} />
            <MokaInput as="checkbox" name="subTitle" id="subTitle" inputProps={{ label: '부제', custom: true }} />
            <MokaInput as="checkbox" name="namePlate" id="namePlate" inputProps={{ label: '어깨제목', custom: true }} />
            <MokaInput as="checkbox" name="titlePrefix" id="titlePrefix" inputProps={{ label: '말머리', custom: true }} />
            <MokaInput as="checkbox" name="bodyHead" id="bodyHead" inputProps={{ label: '발췌문 ', custom: true }} />

            <MokaInput value={value} onChange={(e) => setValue(e.target.value)} />
        </MokaModal>
    );
};

export default EditDeskingPartModal;
