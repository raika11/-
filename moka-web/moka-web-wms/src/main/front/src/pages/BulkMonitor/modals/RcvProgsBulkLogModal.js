import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaModal, MokaTable } from '@/components';
import columnDefs from './RcvProgsBulkLogAgGridColumns';

const RcvProgsBulkLogModal = (props) => {
    const { show, onHide, data } = props;

    /**
     * input value change
     */
    const handleChangeValue = () => {};

    return (
        <MokaModal size="lg" show={show} onHide={onHide}>
            <div className="d-flex">
                <div className="d-flex flex-column">
                    <Form className="mb-3">
                        <MokaInputLabel className="mb-2" label="기사 ID" value={undefined} onChange={handleChangeValue} />
                        <MokaInputLabel className="mb-2" label="제목" value={undefined} onChange={handleChangeValue} />
                        <Form.Row>
                            <MokaInputLabel label="매체" value={undefined} onChange={handleChangeValue} />
                            <MokaInputLabel label="상태" value={undefined} onChange={handleChangeValue} />
                        </Form.Row>
                    </Form>
                    <MokaTable
                        className="flex-fill ag-grid-align-center"
                        columnDefs={columnDefs}
                        onRowNodeId={(params) => params.contentId}
                        rowData={0}
                        paging={false}
                        // loading={loading}
                    />
                </div>
                <div>
                    <Form>
                        {data === '실패' && (
                            <>
                                <p className="mb-2">생성 XML</p>
                                <p className="p-2 mb-2" style={{ height: 136, border: '1px solid #E4EBF6' }}>
                                    {/* {xml} */}
                                </p>
                                <p className="mb-2">메세지</p>
                                <p className="p-2 mb-0" style={{ height: data === '실패' ? 136 : 272, border: '1px solid #E4EBF6' }}>
                                    {/* {message} */}
                                </p>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </MokaModal>
    );
};

export default RcvProgsBulkLogModal;
