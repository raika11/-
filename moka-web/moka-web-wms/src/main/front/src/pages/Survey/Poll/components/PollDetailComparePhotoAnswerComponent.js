import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInput } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

const PollDetailComparePhotoAnswerComponent = ({ items, hasUrl }) => {
    return (
        <Form.Row className="text-center align-items-center w-100">
            <Col xs={5}>
                <PollPhotoComponent width={110} height={110} src={items[0].imgUrl}>
                    150 x 150
                </PollPhotoComponent>
                <div>보기 1</div>
                {(hasUrl || items[0].linkUrl) && <MokaInput placeholder="url" value={items[0].linkUrl} />}
            </Col>
            <Col xs={2} className="text-center">
                VS
            </Col>
            <Col xs={5}>
                <PollPhotoComponent width={110} height={110} src={items[1].imgUrl}>
                    150 x 150
                </PollPhotoComponent>
                <div>보기 2</div>
                {(hasUrl || items[1].linkUrl) && <MokaInput placeholder="url" value={items[1].linkUrl} />}
            </Col>
        </Form.Row>
    );
};

export default PollDetailComparePhotoAnswerComponent;