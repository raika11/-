import React, { useEffect, useState } from 'react';
import { MokaModal, MokaTable } from '@components';

export const columnDefs = [
    {
        headerName: '차단여부',
        field: 'bannedYn',
        tooltipField: 'bannedYn',
        width: 70,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록자/ID',
        field: 'regInfo',
        tooltipField: 'regInfo',
        width: 110,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        tooltipField: 'regDt',
        width: 150,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
];

const tempHistoryList = {
    size: 20,
    total: 4,
    page: 1,
    list: [
        {
            id: 5,
            state: 'A',
            userId: 'ssc0001',
            userName: '홍길동',
            regDt: '2020.12.23 18:04:39',
        },
        {
            id: 4,
            state: 'B',
            userId: 'ssc0001',
            userName: '홍길동',
            regDt: '2020.12.23 18:04:39',
        },
        {
            id: 3,
            state: 'A',
            userId: 'ssc0001',
            userName: '홍길동',
            regDt: '2020.12.23 18:04:39',
        },
        {
            id: 2,
            state: 'B',
            userId: 'ssc0001',
            userName: '홍길동',
            regDt: '2020.12.23 18:04:39',
        },
        {
            id: 1,
            state: 'A',
            userId: 'ssc0001',
            userName: '홍길동',
            regDt: '2020.12.23 18:04:39',
        },
    ],
};

/**
 * ModalBody로 Input 한개 있는 Modal
 */
const BenneHistoryModal = (props) => {
    const { show, onHide, Element } = props;

    const [rowData, setRowData] = useState([]);
    const [banneTitle, setBanneTitle] = useState(``);

    const loading = false;
    /**
     * 닫기
     */
    const handleClickHide = () => {
        onHide();
    };

    useEffect(() => {
        const setModalHeaderTitle = (type) => {
            if (type === 'I') {
                setBanneTitle(`차단 IP 히스토리`);
            } else if (type === 'U') {
                setBanneTitle(`차단 ID 히스토리`);
            }
        };

        // 임시 리스트.
        setRowData(
            tempHistoryList.list.map((e) => {
                return {
                    bannedYn: e.state === 'A' ? '차단' : '복원',
                    regInfo: `${e.userId}/${e.userName}`,
                    regDt: e.regDt,
                };
            }),
        );

        setModalHeaderTitle(Element.tagType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal width={600} show={show} onHide={handleClickHide} title={banneTitle} size="sm" footerClassName="justify-content-center" draggable>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={80}
                onRowNodeId={(data) => data.id}
                loading={loading}
                paging={false}
                selected={0}
            />
        </MokaModal>
    );
};

export default BenneHistoryModal;
