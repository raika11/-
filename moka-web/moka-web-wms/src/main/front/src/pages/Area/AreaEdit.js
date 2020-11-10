import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Form1 from './components/AreaFormDepth1';
import Form2 from './components/AreaFormDepth2';
import { PageListModal } from '@pages/commons';

const AreaEdit = ({ onDelete }) => {
    const { selectedDepth } = useSelector((store) => ({
        selectedDepth: store.area.selectedDepth,
    }));

    // state
    const [modalShow, setModalShow] = useState(false);
    const [modalDomainId, setModalDomainId] = useState();
    const [page, setPage] = useState({});

    /**
     * 페이지선택 모달의 저장버튼
     * @param {object} data page
     */
    const handleClickSave = (data) => {
        setPage(data);
    };

    return (
        <React.Fragment>
            {/* 1뎁스 폼 */}
            {selectedDepth === 1 && <Form1 onDelete={onDelete} />}
            {/* 2뎁스 & 3뎁스 폼 */}
            {selectedDepth !== 1 && (
                <Form2 onShowModal={setModalShow} onChangeModalDomainId={setModalDomainId} onDelete={onDelete} page={page} setPage={setPage} depth={selectedDepth} />
            )}

            {/* 페이지 검색 모달 */}
            <PageListModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={handleClickSave} domainId={modalDomainId} />
        </React.Fragment>
    );
};

export default AreaEdit;
