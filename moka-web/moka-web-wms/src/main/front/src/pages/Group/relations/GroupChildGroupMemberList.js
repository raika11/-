import React from 'react';
import GroupChildMemberAgGrid from '@pages/Group/relations/GroupChildMemberAgGrid';

const GroupChildGroupMemberList = (props) => {
    const { list, paging, onSelect, loading } = props;
    return <GroupChildMemberAgGrid list={list} paging={paging} onSelect={onSelect} loading={loading} />;
};

export default GroupChildGroupMemberList;
