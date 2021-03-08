import React, { useEffect, useState } from 'react';
import { MokaModal, MokaTable } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { getBlockHistory, clearBlockHistory, GET_BLOCK_HISTORY } from '@store/commentManage';

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
        flex: 1,
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

/**
 * 댓글 관리 > 차단 히스토리 모달
 */
const BannedHistoryModal = (props) => {
    const { show, onHide, Element } = props;
    const { seqNo } = Element;
    const dispatch = useDispatch();

    const { list, loading } = useSelector((store) => ({
        list: store.comment.blockHistory.list,
        loading: store.loading[GET_BLOCK_HISTORY],
    }));

    const [rowData, setRowData] = useState([]);
    const [banneTitle, setBanneTitle] = useState(``);

    /**
     * 닫기
     */
    const handleClickHide = () => {
        dispatch(clearBlockHistory());
        onHide();
    };

    useEffect(() => {
        // 팝업이 뜨면 목록 가지고 오기.
        const setModalHeaderTitle = (type) => {
            if (type === 'I') {
                setBanneTitle(`차단 IP 히스토리`);
            } else if (type === 'U') {
                setBanneTitle(`차단 ID 히스토리`);
            }
        };

        const getHistoryList = () => {
            dispatch(getBlockHistory({ seqNo: seqNo }));
        };

        if (show === true) {
            setModalHeaderTitle(Element.tagType);
            getHistoryList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        // store 목록이 업데이트 되면 그리드 데이터 설정.
        const setGridRowData = (data) => {
            setRowData(
                data.map((e, index) => {
                    return {
                        id: `${e.regDt}-${index}`,
                        bannedYn: e.usedYn === 'Y' ? '차단' : '복원',
                        regInfo: `${e.regMember.memberNm} / ${e.regMember.memberId}`,
                        regDt: e.regDt,
                    };
                }),
            );
        };

        setGridRowData(list);
    }, [list]);

    return (
        <MokaModal size="md" width={600} show={show} onHide={handleClickHide} title={banneTitle} draggable>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={80}
                onRowNodeId={(data) => data.id}
                loading={loading}
                paging={false}
            />
        </MokaModal>
    );
};

export default BannedHistoryModal;
