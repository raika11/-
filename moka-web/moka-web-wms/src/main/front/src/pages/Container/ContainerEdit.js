import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInputLabel } from '@components';

/**
 * 컨테이너 정보/수정 컴포넌트
 */
const ContainerEdit = () => {
    return (
        <MokaCard titleClassName="h-100 mb-0" title="컨테이너 정보">
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-end">
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05">
                            저장
                        </Button>
                        <Button variant="danger">삭제</Button>
                    </div>
                </Form.Group>
                {/* 컨테이너ID */}
                <MokaInputLabel className="mb-2" label="컨테이너ID" value="25555" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 컨테이너명 */}
                <MokaInputLabel className="mb-2" label="컨테이너명" value="컨테이너명" onChange={() => {}} placeholder="컨테이너명을 입력하세요" required />
            </Form>
        </MokaCard>
    );
};

export default ContainerEdit;
