import React, { useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/components/RelationPollAgGridColumns';

const RelationPollModalAgGridComponent = ({ polls, onAdd }) => {
    const handleClickAdd = (data) => {
        // console.log('polls', polls);
        // console.log('data', data);
        onAdd([...polls, { id: data.id, title: data.title }]);
    };

    return (
        <MokaTable
            columnDefs={columnDefs}
            size={20}
            total={2}
            page={0}
            onRowNodeId={(row) => row.id}
            rowData={[
                {
                    id: '1',
                    section: '정치',
                    title: '최근 남자가수 그룹인 방탄소년단이 한국\n 가수 최초로 미국 빌보드\n 메인 싱글차트 1위라는 기록을 가지게되었다.',
                    status: '진행',
                    onAdd,
                },
                {
                    id: '2',
                    section: '정치',
                    title: '1최근 남자가수 그룹인 방탄소년단이 한국\n 가수 최초로 미국 빌보드\n 메인 싱글차트 1위라는 기록을 가지게되었다.',
                    status: '진행',
                    onAdd,
                },
            ]}
            rowHeight={65}
            agGridHeight={600}
        />
    );
};

export default RelationPollModalAgGridComponent;
