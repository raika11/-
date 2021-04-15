import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaInputLabel } from '@components';
import { ArticleTabModal } from '@pages/Article/modals';

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const [open, setOpen] = useState({
        art: false,
    });
    const [modal, setModal] = useState({
        art: false,
    });
    const controls = {
        art: 'collapse-art',
    };

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column">
            <Row className="py-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel
                        as="switch"
                        label="메인기사"
                        id="art-switch"
                        inputProps={{ checked: open.art, 'aria-controls': controls.art, 'aria-expanded': open.art, 'data-toggle': 'collapse' }}
                        onChange={(e) => {
                            setOpen({ ...open, art: e.target.checked });
                        }}
                    />
                </Col>
                <Col xs={4}>
                    <Button variant="searching" className="mr-1" onClick={() => setModal({ ...modal, art: true })}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={modal.art} onHide={() => setModal({ ...modal, art: false })} />
                </Col>
                <Col xs={5} className="d-flex justify-content-end">
                    <Button variant="outline-neutral" className="mr-1">
                        미리보기
                    </Button>
                    <Button variant="positive-a" className="mr-1">
                        임시저장
                    </Button>
                    <Button variant="positive">전송</Button>
                </Col>
            </Row>
            <Collapse in={open.art}>
                <div id={controls.art} className="mt-3">
                    숨겨진 컨텐츠
                </div>
            </Collapse>
        </MokaCard>
    );
};

export default IssueDesking;
