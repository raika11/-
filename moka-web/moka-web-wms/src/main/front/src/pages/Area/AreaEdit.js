import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Form1 from './components/AreaFormDepth1';
import Form2 from './components/AreaFormDepth2';
import Form3 from './components/AreaFormDepth3';
import { PageListModal } from '@pages/commons';

const AreaEdit = () => {
    const { selectedDepth } = useSelector((store) => ({
        selectedDepth: store.area.selectedDepth,
    }));

    // state
    const [modalShow, setModalShow] = useState(false);
    const [modalDomainId, setModalDomainId] = useState();
    const [page, setPage] = useState({});

    const handleClickSave = (data) => {
        setPage(data);
    };

    return (
        <React.Fragment>
            {/* 1뎁스 폼 */}
            {selectedDepth === 1 && <Form1 />}
            {/* 2뎁스 폼 */}
            {selectedDepth === 2 && <Form2 onShowModal={setModalShow} onChangeModalDomainId={setModalDomainId} page={page} />}
            {/* 3뎁스 폼 */}
            {selectedDepth === 3 && <Form3 onShowModal={setModalShow} onChangeModalDomainId={setModalDomainId} page={page} />}

            {/* 페이지 검색 모달 */}
            <PageListModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={handleClickSave} domainId={modalDomainId} />
        </React.Fragment>
    );
};

export default AreaEdit;
