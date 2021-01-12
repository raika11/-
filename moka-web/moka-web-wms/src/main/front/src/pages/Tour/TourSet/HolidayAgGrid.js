import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './HolidayAgGridColumns';
import HolidayRegistrationModal from './modals/HolidayRegistrationModal';

/**
 * 견학 기본설정 휴일 AgGrid
 */
const HolidayAgGrid = () => {
    const [show, setShow] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalData, setModalData] = useState({});
    const editRef = useRef(null);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    /**
     * 수정 버튼
     */
    const handleClickModify = useCallback((data) => {
        setModalData(data);
        setShow(true);
    }, []);

    /**
     * 삭제 버튼
     */
    const handleClickDelete = useCallback((row) => {
        // console.log(row);
    }, []);

    useEffect(() => {
        const list = [
            { holidayName: 'test', date: '2021-01-01' },
            { holidayName: 'test2', date: '2021-01-01' },
            { holidayName: 'test3', date: '2021-01-01' },
        ];

        if (list.length > 0) {
            setRowData(
                list.map((data) => {
                    return {
                        ...data,
                        onModify: handleClickModify,
                        onDelete: handleClickDelete,
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [handleClickDelete, handleClickModify]);

    return (
        <>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="positive" className="ft-12" onClick={() => setShow(true)}>
                    휴일등록
                </Button>
            </div>
            <MokaTable
                ref={editRef}
                agGridHeight={630}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.holidayName}
                onRowClicked={handleRowClicked}
                // loading={loading}
                page={search.page}
                size={search.size}
                pageSizes={false}
                showTotalString={false}
                paginationClassName="justify-content-center"
                preventRowClickCell={['editButton']}
                selected={rowData.holidayName}
                onChangeSearchOption={handleChangeSearchOption}
            />
            <HolidayRegistrationModal show={show} onHide={() => setShow(false)} data={modalData} />
        </>
    );
};

export default HolidayAgGrid;
