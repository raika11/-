import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import Depth3 from './AreaAgGridDepth3';

const AreaAgGridDepth2 = ({ match }) => {
    const { areaSeq } = useParams();

    console.log(areaSeq);

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10">
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex justify-content-end">
                        <Button variant="dark">추가</Button>
                    </Col>
                </Form.Row>

                <MokaTable agGridHeight={738} rowData={[]} header={false} paging={false} dragging={false} onRowNodeId={(data) => data.areaSeq} />
            </MokaCard>

            <Route path={[`${match.url}/:areaSeq`, match.url]} strict component={Depth3} />
        </React.Fragment>
    );
};

export default AreaAgGridDepth2;
