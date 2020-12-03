import React from 'react';
import GroupChildMemberAgGrid from '@pages/Group/relations/GroupChildMemberAgGrid';

const GroupChildSearchMemberList = ({ list, total, page, size, onChangeSearchOption, onSelect, loading, setGridInstance }) => {
    const handleChangeSearchOption = (data) => {
        onChangeSearchOption({ name: data.key, value: data.value });
    };
    return (
        <GroupChildMemberAgGrid
            list={list}
            total={total}
            page={page}
            size={size}
            onChangeSearchOption={handleChangeSearchOption}
            onSelect={onSelect}
            loading={loading}
            setGridInstance={setGridInstance}
        />
    );
};

export default GroupChildSearchMemberList;
