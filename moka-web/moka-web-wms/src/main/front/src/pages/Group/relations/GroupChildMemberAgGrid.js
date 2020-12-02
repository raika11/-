import React, { useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/relations/GroupChildMemberAgGridColumns';

const propTypes = {};

const defaultProps = {
    list: [],
};

const GroupChildMemberAgGrid = ({ list, paging, total, page, size, onChangeSearchOption, onSelect, loading }) => {
    /*const [selected, setSelected] = useState('');
    const handleRowSelection = (data, params) => {
        setSelected(data.memberId);
        //params.api.setSuppressRowClickSelection(data);
        console.log(params.api);
    };*/

    const handleSelectionChanged = (selectedNodes, rowSelection) => {
        if (onSelect instanceof Function) {
            onSelect(selectedNodes);
        }
    };

    return (
        <MokaTable
            agGridHeight={600}
            className="article-list"
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
        />
    );
};

GroupChildMemberAgGrid.prototype = propTypes;
GroupChildMemberAgGrid.defaultProps = defaultProps;

export default GroupChildMemberAgGrid;
