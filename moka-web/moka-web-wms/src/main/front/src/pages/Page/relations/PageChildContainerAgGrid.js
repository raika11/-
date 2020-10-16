import React, { useState, useCallback } from 'react';
import { columnDefs, rowData } from './PageChildContainerAgGridColumns';
import { MokaTable } from '@components';
import ContainerHtmlModal from '../modals/ContainerHtmlModal';

/**
 * 페이지의 관련컨테이너 AgGrid 목록
 * @param {*} props
 */
const PageChildContainerAgGrid = (props) => {
    const [total] = useState(rowData.length);
    const [loading] = useState(false);
    const [search] = useState({ page: 0, size: 10 });
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     * @param {object} row 선택된 row데이타
     */
    const handleRowClicked = useCallback((row) => {
        setSelected(row);
        setShowModal(true);
    }, []);

    return (
        <>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={rowData}
                getRowNodeId={(params) => params.containerSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['append', 'link']}
            />
            {/* 설정 변경가능한 Table */}
            {/* <div className="ag-theme-moka-grid mb-3" style={{ height: '550px' }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} getRowNodeId={(params) => params.containerSeq} immutableData animateRows />
            </div>
            <MokaPagination total={total} page={search.page} size={search.size} onChangeSearchOption={handleChangeSearchOption} /> */}
            <ContainerHtmlModal title={selected.containerName} containerBody={selected.containerBody} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default PageChildContainerAgGrid;
