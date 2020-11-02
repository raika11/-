import React, { useState, useCallback } from 'react';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';

// 임시 데이터
import { columnDefs, rowData } from '@/pages/commons/LookupContainerListColumns';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MovePageListModal = (props) => {
    const { show, onHide } = props;
    const [total] = useState(rowData.length);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="이동사이트 검색"
            buttons={[
                {
                    text: '등록',
                    variant: 'primary',
                    onClick: onHide,
                },
                {
                    text: '취소',
                    variant: 'gray150',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <div>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column xs={1} className="px-0">
                            구분
                        </Form.Label>
                        <Col xs={3} className="px-0 my-auto pr-2">
                            <Form.Control as="select" custom>
                                <option>전체</option>
                            </Form.Control>
                        </Col>
                        <Col xs={8} className="px-0 my-auto">
                            <MokaSearchInput />
                        </Col>
                    </Form.Group>
                </Form>
                <MokaTable
                    columnDefs={columnDefs}
                    rowData={rowData}
                    getRowNodeId={(params) => params.containerSeq}
                    agGridHeight={400}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                />
            </div>
        </MokaModal>
    );
};

export default MovePageListModal;
