import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';

/**
 * 중요도 폼 (5개 중에 셀렉트)
 */
const ContentPriorityForm = ({ temp, onChange }) => {
    return (
        <Form.Row className="mb-2">
            <Col xs={3} className="p-0">
                <MokaInputLabel label="중요도" as="select" name="contentPriority" value={temp.contentPriority} onChange={onChange}>
                    <option value="">선택</option>
                    {[...Array(5)].map((n, idx) => (
                        <option key={idx} value={`0${idx + 1}`}>
                            {idx + 1}
                        </option>
                    ))}
                </MokaInputLabel>
            </Col>
        </Form.Row>
    );
};

export default ContentPriorityForm;
