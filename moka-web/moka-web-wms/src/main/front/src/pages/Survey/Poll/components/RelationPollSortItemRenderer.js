import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import { MokaTableEditCancleButton } from '@components';

const RelationPollSortItemRenderer = ({ item, onDelete }) => {
    const handleClickDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(item.ordNo);
        }
    };

    return (
        <>
            <Row>
                <Col className="align-self-center justify-content-start mb-0 pr-0 pl-3 w-100">{item.ordNo}</Col>
                <Col xs={10}>
                    <Row>
                        <MokaInputLabel name="title" id={`poll-title-${item.ordNo}`} labelWidth={30} value={item.title} className="col mb-0 pl-0 pr-0 pt-1" disabled />
                    </Row>
                </Col>
                <Col className="d-felx align-self-center text-left mb-0 pl-0">
                    <MokaTableEditCancleButton onClick={handleClickDelete} />
                </Col>
            </Row>
        </>
    );
};

export default RelationPollSortItemRenderer;
