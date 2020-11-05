import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaTable } from '@components';
import { changeLatestDomainId } from '@store/auth';

const AreaAgGrid1Depth = () => {
    const dispatch = useDispatch();
    const { domainList, latestDomainId } = useSelector((store) => ({
        domainList: store.auth.domainList,
        latestDomainId: store.auth.latestDomainId,
    }));

    return (
        <MokaCard header={false} width={280} className="mr-10">
            <Form.Row className="mb-2">
                <Col xs={7} className="p-0">
                    <MokaInput as="select" value={latestDomainId} onChange={(e) => dispatch(changeLatestDomainId(e.target.value))}>
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainName}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 d-flex justify-content-end">
                    <Button variant="dark">추가</Button>
                </Col>
            </Form.Row>

            <MokaTable agGridHeight={738} rowData={[]} header={false} paging={false} dragging={false} />
        </MokaCard>
    );
};

export default AreaAgGrid1Depth;
