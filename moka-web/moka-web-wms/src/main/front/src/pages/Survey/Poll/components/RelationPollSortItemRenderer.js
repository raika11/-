import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaTableEditCancleButton, MokaPrependLinkInput } from '@components';

const RelationPollSortItemRenderer = ({ item, onDelete }) => {
    const handleClickDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(item.ordNo);
        }
    };

    return (
        <Row className="d-flex flex-fill align-items-center h-100">
            <Col className="justify-content-start mb-0 pr-0 w-100" xs={1}>
                {item.ordNo}
            </Col>
            <Col xs={10}>
                <MokaPrependLinkInput
                    linkText={`ID: ${item.contentId}`}
                    inputList={{
                        value: item.title || '',
                        disabled: true,
                        name: 'title',
                        className: 'bg-white',
                    }}
                />
            </Col>
            <Col className="d-felx align-self-center text-left mb-0 pl-0">
                <MokaTableEditCancleButton onClick={handleClickDelete} />
            </Col>
        </Row>
    );
};

export default RelationPollSortItemRenderer;
