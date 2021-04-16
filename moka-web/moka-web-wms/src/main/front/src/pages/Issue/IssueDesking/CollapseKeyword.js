import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaTable } from '@components';
import { keywordColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 키워드
 */
const CollapseKeyword = ({ gridInstance, setGridInstance }) => {
    const controls = 'collapse-keyword';
    const [open, setOpen] = useState(false);

    return (
        <>
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel as="switch" label="키워드" id={controls} inputProps={{ checked: open }} onChange={(e) => setOpen(e.target.checked)} />
                </Col>
                <Col xs={4}></Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
                    <Button variant="outline-neutral" size="sm" className="mr-1">
                        미리보기
                    </Button>
                    <Button variant="positive-a" size="sm" className="mr-1">
                        임시저장
                    </Button>
                    <Button variant="positive" size="sm">
                        전송
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={90}
                        header={false}
                        paging={false}
                        columnDefs={keywordColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </>
    );
};

export default CollapseKeyword;
