import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { MokaModal } from '@/components';
import columnDefs, { rowData } from './OrderModalAgGridColumns';

/**
 * 아젠다 순서 모달
 */
const AgendaOrderModal = (props) => {
    const { show, onHide } = props;
    const [instance, setInstance] = useState(null);

    const handleGridReady = (params) => {
        setInstance(params);
    };

    return (
        <MokaModal
            height={685}
            title="아젠다 순서"
            show={show}
            onHide={onHide}
            size="sm"
            bodyClassName="pb-2"
            buttons={[
                {
                    text: '수정',
                    variant: 'positive',
                    onClick: () => {
                        console.log(instance);
                        let arr = [];
                        instance.api.forEachNode((node) => {
                            arr.push(node.data);
                        });

                        arr.map((na, idx) => ({
                            ...na,
                            ordNo: idx,
                        }));
                    },
                },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            draggable
        >
            <div className="ag-theme-moka-dnd-grid position-relative h-100">
                <AgGridReact
                    onGridReady={handleGridReady}
                    immutableData
                    rowData={rowData}
                    getRowNodeId={(params) => params.ordNo}
                    columnDefs={columnDefs}
                    // onRowSelected={handleRowSelected}
                    animateRows
                    rowDragManaged={true}
                    suppressRowClickSelection
                    // onCellClicked={handleCellClicked}
                />
            </div>
        </MokaModal>
    );
};

export default AgendaOrderModal;
