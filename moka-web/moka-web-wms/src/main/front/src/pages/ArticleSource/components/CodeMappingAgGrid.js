import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './CodeMappingAgGridColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import { getMappingCodeList, changeModalSearchOption } from '@store/articleSource';

const CodeMappingAgGrid = (props) => {
    const { show, data, loading, mappingList, mappingTotal, search, mappingCode, handleRowClicked, handleChangeSearchOption } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (show && data.sourceCode) {
            dispatch(getMappingCodeList(changeModalSearchOption({ ...search, sourceCode: data.sourceCode })));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* AgGrid */}
            <MokaTable
                agGridHeight={443}
                columnDefs={columnDefs}
                rowData={mappingList}
                onRowNodeId={(row) => row.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={mappingTotal}
                page={search.page}
                size={search.size}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
                selected={mappingCode.seqNo}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default CodeMappingAgGrid;
