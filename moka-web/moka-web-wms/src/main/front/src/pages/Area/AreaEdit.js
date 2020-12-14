import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Form1 from './components/AreaFormDepth1';
import Form2 from './components/AreaFormDepth2';
import toast from '@utils/toastUtil';
import { PageListModal } from '@pages/Page/modals';

const AreaEdit = ({ onDelete }) => {
    const { selectedDepth, areaError } = useSelector((store) => ({
        selectedDepth: store.area.selectedDepth,
        areaError: store.area.areaError,
    }));

    const { errorDepth1, errorDepth2, errorDepth3 } = useSelector((store) => ({
        errorDepth1: store.area.depth1.error,
        errorDepth2: store.area.depth2.error,
        errorDepth3: store.area.depth3.error,
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

    useEffect(() => {
        if (areaError) {
            toast.error(areaError.header.message);
        }
        if (errorDepth1) {
            toast.error(errorDepth1.header.message);
        }
        if (errorDepth2) {
            toast.error(errorDepth2.header.message);
        }
        if (errorDepth3) {
            toast.error(errorDepth3.header.message);
        }
    }, [areaError, errorDepth1, errorDepth2, errorDepth3]);

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
