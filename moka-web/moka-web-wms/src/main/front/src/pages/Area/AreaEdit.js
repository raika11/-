import React, { useState } from 'react';
import { MokaCard } from '@components';

import AreaForm1Depth from './components/AreaForm1Depth';
import AreaForm2Depth from './components/AreaForm2Depth';
import AreaForm3Depth from './components/AreaForm3Depth';
import { PageListModal } from '@pages/commons';

const AreaEdit = () => {
    // state
    const [formType, setFormType] = useState('2depth');
    const [modalShow, setModalShow] = useState(false);
    const [page, setPage] = useState({});

    const handleClickSave = (data) => {
        setPage(data);
    };

    return (
        <MokaCard title="편집영역 등록" className="flex-fill">
            {/* 1뎁스 폼 */}
            {formType === '1depth' && <AreaForm1Depth />}
            {/* 2뎁스 폼 */}
            {formType === '2depth' && <AreaForm2Depth onShowModal={setModalShow} page={page} />}
            {/* 3뎁스 폼 */}
            {formType === '3depth' && <AreaForm3Depth onShowModal={setModalShow} page={page} />}

            {/* 페이지 검색 모달 */}
            <PageListModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={handleClickSave} />
        </MokaCard>
    );
};

export default AreaEdit;
