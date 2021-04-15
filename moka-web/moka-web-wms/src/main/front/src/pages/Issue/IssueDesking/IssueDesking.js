import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaInputLabel, MokaTable } from '@components';
import { ArticleTabModal } from '@pages/Article/modals';
import { artColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const [artInstance, setArtInstance] = useState(null);
    const [open, setOpen] = useState({
        art: false,
    });
    const [modal, setModal] = useState({
        art: false,
    });
    const controls = {
        art: 'collapse-art',
    };

    /**
     * 기사 선택
     * @param {string} type type
     * @param {object} data data
     */
    const selectArticle = (type, data) => {
        artInstance.api.applyTransaction({
            add: [data],
        });
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
                        onChange={(e) => setOpen({ ...open, art: e.target.checked })}
                    />
                </Col>
                <Col xs={4} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setModal({ ...modal, art: true })}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={modal.art} onHide={() => setModal({ ...modal, art: false })} onRowClicked={selectArticle} />
                </Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
                    <Button variant="outline-neutral" size="sm" className="mr-1">
                        미리보기
                    </Button>
                    <Button variant="positive-a" size="sm" className="mr-1">
                        임시저장
                    </Button>
                    <Button variant="positive" size="sm">
                        전송
                    </Button>
                </Col>
            </Row>
            <Collapse in={open.art}>
                <div id={controls.art} className="mt-2">
                    <MokaTable
                        rowHeight={210}
                        header={false}
                        paging={false}
                        columnDefs={artColumnDefs}
                        onRowNodeId={(data) => data.totalId}
                        setGridInstance={setArtInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </MokaCard>
    );
};

export default IssueDesking;
