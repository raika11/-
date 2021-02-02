import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { MokaModal } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { getMicAgendaListModal, putMicAgendaSort } from '@store/mic';
import columnDefs from './OrderModalAgGridColumns';

moment.locale('ko');

/**
 * 아젠다 순서 모달
 */
const AgendaOrderModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([]);

    /**
     * 그리드 onGridReady
     * @param {object} params grid instance
     */
    const handleGridReady = (params) => {
        setInstance(params);
    };

    /**
     * 수정
     */
    const handleSave = () => {
        setLoading(true);

        const api = instance.api;
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            displayedRows.push({ agndSeq: data.agndSeq, ordNo: i + 1 });
        }

        dispatch(
            putMicAgendaSort({
                sortedList: displayedRows,
                callback: ({ header, body }) => {
                    if (header.success && body) {
                        toast.success(header.message);
                    } else {
                        messageBox.alert(header.message);
                    }
                    setLoading(false);
                },
            }),
        );
    };

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleDragEnd = (params) => {
        const api = params.api;
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            displayedRows.push({ ...data, ordNo: i + 1 });
        }
        api.applyTransaction({ update: displayedRows });
    };

    useEffect(() => {
        if (show) {
            const nt = new Date();
            setLoading(true);
            dispatch(
                getMicAgendaListModal({
                    // 검색조건 고정!
                    search: {
                        agndTop: 'Y',
                        page: 0,
                        size: 15,
                        startDt: moment('2017-05-25', 'YYYY-MM-DD').format(DB_DATEFORMAT),
                        endDt: moment(nt).format(DB_DATEFORMAT),
                        keyword: null,
                    },
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            setRowData(body.list);
                        }
                        setLoading(false);
                    },
                }),
            );
        } else {
            setRowData([]);
        }
    }, [dispatch, show]);

    return (
        <MokaModal
            height={685}
            title="아젠다 순서"
            show={show}
            onHide={onHide}
            size="sm"
            loading={loading}
            buttons={[
                { text: '수정', variant: 'positive', onClick: handleSave },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            centered
        >
            <div className="ag-theme-moka-dnd-grid position-relative w-100 h-100">
                <AgGridReact
                    onGridReady={handleGridReady}
                    immutableData
                    rowData={rowData}
                    getRowNodeId={(data) => data.agndSeq}
                    columnDefs={columnDefs}
                    animateRows
                    rowDragManaged
                    onRowDragEnd={handleDragEnd}
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                />
            </div>
        </MokaModal>
    );
};

export default AgendaOrderModal;
