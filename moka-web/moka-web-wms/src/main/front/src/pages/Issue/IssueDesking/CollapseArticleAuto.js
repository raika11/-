import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';

/**
 * 패키지관리 > 관련 데이터 편집 > 기사 (자동)
 */
const CollapseArticleAuto = () => {
    const controls = 'collapse-art-auto';
    const [open, setOpen] = useState(false);

    return (
        <>
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel as="switch" label="메인기사" id={controls} inputProps={{ checked: open }} onChange={(e) => setOpen(e.target.checked)} />
                </Col>
                <Col xs={6} className="d-flex align-items-center">
                    <span>조회수가 가장 높은 기사가 자동으로 노출됩니다</span>
                </Col>
                <Col xs={3} className="d-flex justify-content-end align-items-center">
                    <Button variant="outline-neutral" size="sm" className="mr-1">
                        미리보기
                    </Button>
                    <Button variant="positive" size="sm">
                        전송
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default CollapseArticleAuto;
