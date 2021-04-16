import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { ArticleTabModal } from '@pages/Article/modals';
import { liveColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 라이브기사
 */
const CollapseLive = ({ gridInstance, setGridInstance }) => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const controls = 'collapse-live';

    /**
     * 기사 선택
     * @param {string} type type
     * @param {object} data data
     */
    const selectArticle = (type, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();
        if (cnt < 1) {
            gridInstance.api.setRowData([data]);
        } else {
            messageBox.confirm(
                '라이브 기사 등록은 1개만 등록 가능합니다.\n등록된 기사를 삭제 후 등록하시겠습니까?',
                () => {
                    gridInstance.api.setRowData([data]);
                },
                () => {},
            );
        }
    };

    return (
        <>
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel
                        as="switch"
                        label="라이브기사"
                        id={controls}
                        inputProps={{ checked: open, 'aria-controls': controls, 'aria-expanded': open, 'data-toggle': 'collapse' }}
                        onChange={(e) => setOpen(e.target.checked)}
                    />
                </Col>
                <Col xs={4} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setShow(true)}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={selectArticle} />
                </Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
                    <Button variant="positive-a" size="sm" className="mr-1">
                        임시저장
                    </Button>
                    <Button variant="positive" size="sm">
                        전송
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={90}
                        header={false}
                        paging={false}
                        columnDefs={liveColumnDefs}
                        onRowNodeId={(data) => data.totalId}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </>
    );
};

export default CollapseLive;
