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
            <Row className="d-flex flex-fill align-items-center mb-1">
                <Col className="justify-content-start mb-0 pr-0 w-100" xs={1}>
                    {item.ordNo}
                </Col>
                <Col xs={10}>
                    <Row>
                        <Col xs={2} className="mb-0 pl-0 pr-0">
                            <MokaInputLabel name="id" id={`poll-id-${item.ordNo}`} labelWidth={30} value={`ID: ${item.seqNo}`} disabled />
                        </Col>
                        <Col xs={10} className="mb-0 pl-0 pr-0">
                            <MokaInputLabel name="title" id={`poll-title-${item.ordNo}`} labelWidth={30} value={item.title} disabled />
                        </Col>
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
