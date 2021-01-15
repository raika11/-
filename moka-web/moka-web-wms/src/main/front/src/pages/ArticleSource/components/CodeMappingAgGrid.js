import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './CodeMappingAgGridColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import { getMappingCodeList, changeModalSearchOption } from '@store/articleSource';

const CodeMappingAgGrid = (props) => {
    const { show, data, loading, mappingList, mappingTotal, search, mappingCode, handleClickAdd, handleRowClicked, handleChangeSearchOption } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (show && data.sourceCode) {
            dispatch(getMappingCodeList(changeModalSearchOption({ ...search, sourceCode: data.sourceCode })));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex flex-column">
            {/* 등록 */}
            <div className="mb-2 d-flex justify-content-end">
                <Button style={{ borderRadius: '3px 3px 3px 3px' }} variant="outline-table-btn" onClick={handleClickAdd}>
                    신규 등록
                </Button>
            </div>

            {/* AgGrid */}
            <MokaTable
                columnDefs={columnDefs}
                agGridHeight={450}
                rowData={mappingList}
                onRowNodeId={(row) => row.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={mappingTotal}
                page={search.page}
                size={search.size}
                paginationSize="sm"
                pageSizes={MODAL_PAGESIZE_OPTIONS}
                selected={mappingCode.seqNo}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </div>
    );
};

export default CodeMappingAgGrid;
