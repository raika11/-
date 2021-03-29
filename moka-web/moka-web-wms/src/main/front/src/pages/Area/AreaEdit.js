import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Form1 from './components/AreaFormDepth1';
import Form2 from './components/AreaFormDepth2';
import Form3 from './components/AreaFormDepth3';
import { messageBox } from '@utils/toastUtil';
import { PageListModal } from '@pages/Page/modals';

const AreaEdit = (props) => {
    const { areaDepth1, areaDepth2, areaDepth3, listDepth2, listDepth3, ...rest } = props;
    const selectedDepth = useSelector(({ area }) => area.selectedDepth);
    const [modalShow, setModalShow] = useState(false);
    const [modalDomainId, setModalDomainId] = useState();
    const [page, setPage] = useState({});

    /**
     * 페이지선택 모달의 저장버튼
     * @param {object} data page
     */
    const handleClickSave = (data) => {
        messageBox.confirm(
            '페이지 정보가 변경되어 컴포넌트&컨테이너 정보가 초기화됩니다.',
            () => {
                setPage(data);
                setModalShow(false);
            },
            () => {},
        );
    };

    useEffect(() => {
        if (selectedDepth === 1) {
            setPage(areaDepth1.area?.page || {});
        } else if (selectedDepth === 2) {
            setPage(areaDepth2.area?.page || {});
        } else if (selectedDepth === 3) {
            setPage(areaDepth3.area?.page || {});
        }
    }, [areaDepth1.area, areaDepth2.area, areaDepth3.area, selectedDepth]);

    return (
        <React.Fragment>
            {/* 1뎁스 폼 */}
            {selectedDepth === 1 && <Form1 {...rest} child={listDepth2} area={areaDepth1} />}
            {/* 2뎁스 폼 */}
            {selectedDepth === 2 && (
                <Form2
                    {...rest}
                    setModalShow={setModalShow}
                    setModalDomainId={setModalDomainId}
                    page={page}
                    setPage={setPage}
                    depth={selectedDepth}
                    child={listDepth3}
                    list={listDepth2}
                    parent={areaDepth1.area}
                    area={areaDepth2}
                />
            )}
            {/* 3뎁스 폼 */}
            {selectedDepth === 3 && (
                <Form3
                    {...rest}
                    setModalShow={setModalShow}
                    setModalDomainId={setModalDomainId}
                    page={page}
                    setPage={setPage}
                    depth={selectedDepth}
                    child={[]}
                    parent={areaDepth2.area}
                    area={areaDepth3}
                    list={listDepth3}
                />
            )}

            {/* 페이지 검색 모달 */}
            <PageListModal show={modalShow} selected={page?.pageSeq} onHide={() => setModalShow(false)} onClickSave={handleClickSave} domainId={modalDomainId} />
        </React.Fragment>
    );
};

export default AreaEdit;
