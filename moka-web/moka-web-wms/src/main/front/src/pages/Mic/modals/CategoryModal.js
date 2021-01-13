import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaSearchInput } from '@/components';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData } from './CategoryModalAgGridColumns';
import CategoryEditorRenderer from '../components/CategoryEditorRenderer';

const CategoryModal = (props) => {
    const { show, onHide } = props;
    const [keyword, setKeyword] = useState('');

    return (
        <MokaModal
            height={685}
            title="카테고리 관리"
            show={show}
            onHide={onHide}
            size="md"
            headerClassName="justify-content-start"
            bodyClassName="pb-2"
            buttons={[
                { text: '수정', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <Container className="p-0" fluid>
                <Row>
                    <Col xs={12} className="p-0">
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
                                immutableData
                                rowData={rowData}
                                getRowNodeId={(params) => params.orderNm}
                                columnDefs={columnDefs}
                                // onRowSelected={handleRowSelected}
                                animateRows
                                rowDragManaged={true}
                                suppressRowClickSelection
                                // onCellClicked={handleCellClicked}
                                frameworkComponents={{ editor: CategoryEditorRenderer }}
                            />
                        </div>
                    </Col>
                    <p className="pl-2 mb-0 color-primary ft-12">현재 페이지를 일괄 수정합니다.</p>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default CategoryModal;
