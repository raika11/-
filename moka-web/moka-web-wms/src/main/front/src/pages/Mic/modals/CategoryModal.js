import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaSearchInput } from '@/components';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData } from './CategoryModalAgGridColumns';
import CategoryEditorRenderer from '../components/CategoryEditorRenderer';

/**
 * 시민 마이크 카테고리 모달
 */
const CategoryModal = (props) => {
    const { show, onHide } = props;
    const [keyword, setKeyword] = useState('');
    const [instance, setInstance] = useState(null);

    const handleGridReady = (params) => {
        setInstance(params);
    };

    return (
        <MokaModal
            width={500}
            height={685}
            title="카테고리 관리"
            show={show}
            onHide={onHide}
            size="md"
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
                            orderNm: idx,
                        }));
                    },
                },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <div className="d-flex mb-2">
                <MokaSearchInput
                    buttonClassName="ft-12"
                    placeholder="카테고리명을 입력하세요"
                    className="mr-2 flex-fill"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Button variant="positive" className="ft-12">
                    등록
                </Button>
            </div>
            <div className="ag-theme-moka-desking-grid position-relative">
                <AgGridReact
                    onGridReady={handleGridReady}
                    immutableData
                    rowData={rowData}
                    getRowNodeId={(params) => params.orderNm}
                    columnDefs={columnDefs}
                    animateRows
                    // onRowSelected={handleRowSelected}
                    rowDragManaged={true}
                    suppressRowClickSelection
                    // onCellClicked={handleCellClicked}
                    frameworkComponents={{ editor: CategoryEditorRenderer }}
                />
            </div>
            <p className="pl-2 mb-0 color-primary ft-12">현재 페이지를 일괄 수정합니다.</p>
        </MokaModal>
    );
};

export default CategoryModal;
