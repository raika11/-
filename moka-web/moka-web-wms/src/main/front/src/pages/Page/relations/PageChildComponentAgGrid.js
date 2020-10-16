import React, { useState, useCallback } from 'react';
import { columnDefs, rowData } from './PageChildComponentAgGridColumns';
import { MokaTable } from '@components';
import ComponentHtmlModal from '../modals/ComponentHtmlModal';

/**
 * 관련 컴포넌트 AgGrid 목록
 */
const PageChildComponentAgGrid = (props) => {
    const [total] = useState(rowData.length);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        setSelected(row);
        setShowModal(true);
    }, []);

    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                rowData={rowData}
                getRowNodeId={(params) => params.componentSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['append', 'link']}
            />
            <ComponentHtmlModal title={selected.componentName} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default PageChildComponentAgGrid;
