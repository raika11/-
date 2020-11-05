import React from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';

const AreaAgGridDepth3 = () => {
    return (
        <MokaCard header={false} width={280} className="mr-gutter">
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0 d-flex justify-content-end">
                    <Button variant="dark">추가</Button>
                </Col>
            </Form.Row>

            <MokaTable agGridHeight={738} rowData={[]} header={false} paging={false} dragging={false} onRowNodeId={(data) => data.areaSeq} />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
