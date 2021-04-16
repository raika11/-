import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import util from '@utils/commonUtil';
import { MokaInputLabel, MokaTable } from '@components';
import { autoScroll, classElementsFromPoint, getDisplayedRows } from '@utils/agGridUtil';
import { ArticleTabModal } from '@pages/Article/modals';
import { VodModal } from '@pages/Desking/modals';
import { moviePhotoColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 영상/포토
 */
const CollapseMoviePhoto = ({ gridInstance, setGridInstance }) => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
    const controls = 'collapse-mp';

    /**
     * 기사 등록
     * @param {string} type type
     * @param {object} data data
     */
    const addArticle = (type, data) => {
        const id = `${type}${util.getUniqueKey()}`;
        gridInstance.api.applyTransaction({
            add: [{ ...data, id }],
        });
    };

    /**
     * 스크롤 처리
     */
    const handleRowDragMove = React.useCallback((params) => {
        const scrollBox = classElementsFromPoint(params.event, 'scrollable');
        autoScroll(scrollBox, { clientX: params.event.clientX, clientY: params.event.clientY });
    }, []);

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleRowDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const ordered = displayedRows.map((data, idx) => ({
            ...data,
            ordNo: idx + 1,
        }));
        params.api.applyTransaction({ update: ordered });
    };

    return (
        <>
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel
                        as="switch"
                        label="영상/포토"
                        id={controls}
                        inputProps={{ checked: open, 'aria-controls': controls, 'aria-expanded': open, 'data-toggle': 'collapse' }}
                        onChange={(e) => setOpen(e.target.checked)}
                    />
                </Col>
                <Col xs={4} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setShow(true)}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={addArticle} />

                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setVodShow(true)}>
                        영상검색
                    </Button>
                    <VodModal show={vodShow} onHide={() => setVodShow(false)} />
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
                        rowHeight={46}
                        header={false}
                        paging={false}
                        columnDefs={moviePhotoColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        animateRows
                        rowDragManaged
                        suppressMoveWhenRowDragging
                        onRowDragMove={handleRowDragMove}
                        onRowDragEnd={handleRowDragEnd}
                        dragStyle
                    />
                </div>
            </Collapse>
        </>
    );
};

export default CollapseMoviePhoto;
