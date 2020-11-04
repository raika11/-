import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/relations/GroupChildMemberAgGridColumns';

const propTypes = {};

const defaultProps = {
    list: [],
};

const GroupChildMemberAgGrid = (props) => {
    const { list } = props;
    return <MokaTable columnDefs={columnDefs} rowData={list}></MokaTable>;
};

GroupChildMemberAgGrid.prototype = propTypes;
GroupChildMemberAgGrid.defaultProps = defaultProps;

export default GroupChildMemberAgGrid;
