import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MokaCard } from '@components';

import Form1 from './components/AreaFormDepth1';
import Form2 from './components/AreaFormDepth2';
import Form3 from './components/AreaFormDepth3';
import { PageListModal } from '@pages/commons';

const AreaEdit = () => {
    const { area } = useSelector((store) => ({
        area: store.area.area,
    }));

    // state
    const [modalShow, setModalShow] = useState(false);
    const [page, setPage] = useState({});

    const handleClickSave = (data) => {
        setPage(data);
    };

    return (
        <MokaCard title="편집영역 등록" className="flex-fill">
            {/* 1뎁스 폼 */}
            {area.depth === 1 && <Form1 />}
            {/* 2뎁스 폼 */}
            {area.depth === 2 && <Form2 onShowModal={setModalShow} page={page} />}
            {/* 3뎁스 폼 */}
            {area.depth === 3 && <Form3 onShowModal={setModalShow} page={page} />}

            {/* 페이지 검색 모달 */}
            <PageListModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={handleClickSave} />
        </MokaCard>
    );
};

export default AreaEdit;
