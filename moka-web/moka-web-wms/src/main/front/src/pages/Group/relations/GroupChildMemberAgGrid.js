import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/relations/GroupChildMemberAgGridColumns';

const propTypes = {};

const defaultProps = {
    list: [],
};

const GroupChildMemberAgGrid = ({ list, paging, total, page, size, onChangeSearchOption, onSelect, loading, setGridInstance }) => {
    const handleSelectionChanged = (selectedNodes, rowSelection) => {
        if (onSelect instanceof Function) {
            onSelect(selectedNodes);
        }
    };

    return (
        <MokaTable
            className="ag-grid-rect-checkbox overflow-hidden flex-fill"
            onChangeSearchOption={onChangeSearchOption}
            onRowNodeId={(rowData) => rowData.memberId}
            columnDefs={columnDefs}
            rowData={list}
            page={page}
            loading={loading}
            size={size}
            total={total}
            paging={paging}
            rowSelection="multiple"
            onSelectionChanged={handleSelectionChanged}
            setGridInstance={setGridInstance}
        />
    );
};

GroupChildMemberAgGrid.prototype = propTypes;
GroupChildMemberAgGrid.defaultProps = defaultProps;

export default GroupChildMemberAgGrid;
