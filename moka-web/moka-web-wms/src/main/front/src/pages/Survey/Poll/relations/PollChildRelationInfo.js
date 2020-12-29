import React, { useState } from 'react';
import { MokaCard } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import RelationPollInfoComponent from '@pages/Survey/Poll/components/RelationPollInfoComponent';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';

const PollChildRelation = () => {
    const [isRelationPollModalShow, setIsRelationPollModalShow] = useState(false);
    const test = [
        <RelationPollInfoComponent key={'1'} id={'1'} title={'11'} />,
        <RelationPollInfoComponent key={'2'} id={'2'} title={'22'} />,
        <RelationPollInfoComponent key={'3'} id={'3'} title={'33'} />,
    ];
    const handleClickSearch = () => {
        setIsRelationPollModalShow(true);
    };
    const handleClickClose = () => {
        setIsRelationPollModalShow(false);
    };

    return (
        <div className="d-flex">
            <MokaCard title="관련 정보" headerClassName="pb-0" bodyClassName="pt-0" className="flex-fill">
                <hr />
                <Form>
                    <Form.Row>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label className="pr-2">관련 투표</Form.Label>
                                <Button variant="searching" size="sm" onClick={handleClickSearch}>
                                    검색
                                </Button>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    {test}
                </Form>
            </MokaCard>
            <RelationPollModal show={isRelationPollModalShow} onHide={handleClickClose}></RelationPollModal>
        </div>
    );
};

export default PollChildRelation;
