import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';

/**
 * A/B 테스트 > 전체 목록 > 탭 > 정보 > 주요 설정
 */
const ABMainForm = () => {
    return (
        <div>
            <Form.Row className="justify-content-end mb-2">
                <Button variant="outline-neutral" className="flex-shrink-0 mr-1">
                    복사
                </Button>
                <Button variant="negative">종료</Button>
            </Form.Row>

            <MokaInputLabel label="매체" className="mb-2" as="select" required disabled>
                <option>매체</option>
            </MokaInputLabel>

            <MokaInputLabel label="설계명" className="mb-2" required disabled />

            <Form.Row className="mb-2">
                <MokaInputLabel label="유형" className="mr-32" disabled />
                <MokaInputLabel label="페이지" className="flex-fill" as="select" required disabled>
                    <option>메인페이지</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="영역" className="mr-32 flex-fill" as="select" disabled required>
                    <option>주요기사-오른쪽</option>
                </MokaInputLabel>
                <MokaInputLabel label="테스트대상" className="flex-fill" as="select" required disabled>
                    <option>디자인</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="변수 선택" as="none" />
            </Form.Row>
        </div>
    );
};

export default ABMainForm;
