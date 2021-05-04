import React, { useState, useEffect } from 'react';
import { MokaCard, MokaTable } from '@components';
import { histColumnDefs } from './DesignAgGridColumns';
import DesignHistoryModal from '../modals/DesignHistoryModal';

const example = [
    {
        seqNo: '1',
        field1: '자동변경',
        field2: '2021-03-10 10:20',
        field3: '[뉴스레터] 설정 추가',
        field4: '홍길동(SSC2)',
    },
];

/**
 * 구독 관리 > 구독 설계 > 변경이력
 */
const DesignHistory = () => {
    const [modalShow, setModalShow] = useState(false);
    const [selected, setSelected] = useState(null);

    /**
     * 테이블 row 클릭
     * @param {object} data row데이터
     * @param {object} params ag-grid cellClick params
     */
    const handleRowClicked = (data, params) => {
        if (params.colDef.field === 'field1') {
            setModalShow(true);
            setSelected(data);
        }
    };

    useEffect(() => {
        return () => {
            setSelected(null);
            setModalShow(false);
        };
    }, []);

    return (
        <MokaCard title="구독상품 변경이력" className="w-100" bodyClassName="d-flex flex-column">
            <MokaTable
                className="overflow-hidden flex-fill"
                onRowNodeId={(data) => data.seqNo}
                columnDefs={histColumnDefs}
                rowData={example}
                paging={false}
                onRowClicked={handleRowClicked}
                selected={selected?.seqNo}
            />
            <DesignHistoryModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    setSelected(null);
                }}
            />
        </MokaCard>
    );
};

export default DesignHistory;
