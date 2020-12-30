import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { MokaIcon, MokaInput } from '@components';
import toast from '@utils/toastUtil';

const RelationArticleInfoComponent = ({ id, title, url, onDelete }) => {
    const handleClickDelete = (id) => {
        onDelete(id);
    };
    return (
        <>
            <Form.Row className="pb-2">
                <Col xs={10} className="pr-0 pl-5 d-flex align-content-center flex-fill">
                    <MokaInput value={title} disabled={true} />
                </Col>
                <Col xs={1} className="d-flex align-items-center pr-0 pl-0 ml-2">
                    <Button
                        size="sm"
                        variant="searching"
                        onClick={() => {
                            toast.info('준비중 입니다.');
                        }}
                    >
                        검색
                    </Button>
                </Col>
                <Col xs={1} className="d-flex align-items-center">
                    <Button
                        size="sm"
                        variant="negative"
                        onClick={() => {
                            handleClickDelete(id);
                        }}
                    >
                        <MokaIcon iconName="fal-minus" />
                    </Button>
                </Col>
            </Form.Row>
            <Form.Row className="pb-2">
                <Col xs={11} className="pr-0 pl-5 d-flex align-content-center flex-fill">
                    <MokaInput value={url} disabled={true} />
                </Col>
            </Form.Row>
        </>
    );
};

export default RelationArticleInfoComponent;
