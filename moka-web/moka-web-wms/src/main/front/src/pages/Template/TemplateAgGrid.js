import React, { useState, useCallback } from 'react';
import { columnDefs, rowData } from '../Page/relations/PageChildTemplateAgGridColumns';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { MokaTable, MokaIcon } from '@components';
import { MokaThumbnailTable } from '@/components/MokaTable';

import template from '../Page/template.json';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const TemplateAgGrid = () => {
    /**
     * 썸네일 테이블 total
     */
    const thumbTotal = template.resultInfo.body.totalCnt;

    const [total] = useState(rowData.length);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });
    const [showAgGrid, setShowAgGrid] = useState('list');

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

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10">
                <Nav
                    as={ButtonGroup}
                    size="sm"
                    className="mr-auto"
                    defaultActiveKey="list"
                    onSelect={(selectedKey) => {
                        setShowAgGrid(selectedKey);
                    }}
                >
                    <Nav.Link eventKey="list" as={Button} variant="gray150">
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                    <Nav.Link eventKey="thumbnail" as={Button} variant="gray150">
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                </Nav>
                <div className="pt-0">
                    <Button variant="dark">템플릿 추가</Button>
                </div>
            </div>

            {/* ag-grid table */}
            {showAgGrid === 'list' && (
                <MokaTable
                    columnDefs={columnDefs}
                    rowData={rowData}
                    getRowNodeId={(params) => params.templateSeq}
                    agGridHeight={552}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['append', 'link']}
                />
            )}
            {showAgGrid === 'thumbnail' && (
                <MokaThumbnailTable
                    tableHeight={552}
                    total={thumbTotal}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={(template) => {
                        console.log(template);
                    }}
                />
            )}
        </>
    );
};

export default TemplateAgGrid;
