import React from 'react';
import GroupChildMemberAgGrid from '@pages/Group/relations/GroupChildMemberAgGrid';

const GroupChildSearchMemberList = () => {
    const list = [
        {
            seqNo: '100',
            memberId: 'kim.taehyung',
            memberNm: '김태형',
            group: 'J,A,D,E',
            dept: '비디오팀',
        },
    ];
    return <GroupChildMemberAgGrid list={list} />;
};

export default GroupChildSearchMemberList;
