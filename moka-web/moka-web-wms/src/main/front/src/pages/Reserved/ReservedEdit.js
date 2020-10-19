import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInput } from '@components';

/**
 * 예약어 정보 컴포넌트
 */
const ReservedEdit = () => {
    return (
        <Form>
            {/* 사용여부 */}
            <Form.Group className="d-flex mb-2 justify-content-between align-content-center">
                <MokaInput label="사용여부" labelWidth={80} as="switch" className="mb-0" inputProps={{ id: 'useYn', label: '' }} />
                {/* 버튼 그룹 */}
                <Form.Group className="mb-0 d-flex align-items-center">
                    <Button variant="dark" className="mr-05">
                        저장
                    </Button>
                    <Button variant="secondary">삭제</Button>
                </Form.Group>
            </Form.Group>
            {/* 예약어 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInput label="예약어" labelWidth={80} className="mb-2" placeholder="예약어를 입력하세요" required />
                </Col>
            </Form.Row>
            {/* 값 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInput label="값" labelWidth={80} className="mb-2" placeholder="값을 입력하세요" required />
                </Col>
            </Form.Row>
            {/* 예약어 설명 */}
            <MokaInput label="예약어 설명" labelWidth={80} className="mb-0" placeholder="설명을 입력하세요" />
        </Form>
    );
};

export default ReservedEdit;
