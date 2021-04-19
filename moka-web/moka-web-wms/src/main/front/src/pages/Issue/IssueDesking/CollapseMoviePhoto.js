import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CHANNEL_TYPE, ISSUE_CHANNEL_TYPE } from '@/constants';
import { MokaInputLabel, MokaTable } from '@components';
import { autoScroll, classElementsFromPoint, getDisplayedRows } from '@utils/agGridUtil';
import { messageBox } from '@utils/toastUtil';
import { initialState } from '@store/issue';
import { ArticleTabModal } from '@pages/Article/modals';
import { VodModal } from '@pages/Desking/modals';
import { moviePhotoColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 영상/포토
 */
const CollapseMoviePhoto = ({ pkgSeq, compNo, gridInstance, setGridInstance, deskingList }) => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
    const controls = 'collapse-mp';

    /**
     * 기사 등록
     * @param {string} channelType channelType
     * @param {object} data data
     */
    const addArticle = (channelType, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();

        if (channelType === CHANNEL_TYPE.A.code) {
            gridInstance.api.applyTransaction({
                add: [
                    {
                        ...initialState.initialDesking,
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        contentsId: data.totalId,
                        thumbFileName: data.artThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
                    },
                ],
            });
        } else if (channelType === CHANNEL_TYPE.M.code) {
            gridInstance.api.applyTransaction({
                add: [
                    {
                        ...initialState.initialDesking,
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        contentsId: data.totalId,
                        thumbFileName: data.ovpThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
                    },
                ],
            });
        } else {
            messageBox.alert('기사, 영상탭에서 선택해주세요.');
        }
    };

    /**
     * 영상 등록 ===> 영상 링크 등록할 필드가 없음~~~
     * @param {string} url url path
     * @param {object} data ovp 데이터 (유투브일 경우 null)
     */
    const addMovie = (url, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();

        gridInstance.api.applyTransaction({
            add: [
                {
                    ...initialState.initialDesking,
                    pkgSeq,
                    compNo,
                    contentsOrd: cnt + 1,
                    contentsId: data.id,
                    thumbFileName: data.thumbFileName,
                    title: data.name,
                    channelType: ISSUE_CHANNEL_TYPE.M.code,
                },
            ],
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

    useEffect(() => {
        if (gridInstance) gridInstance.api.setRowData(deskingList);
    }, [gridInstance, deskingList]);

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
                    <VodModal show={vodShow} onHide={() => setVodShow(false)} onSave={addMovie} />
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
                        onRowNodeId={(data) => data.contentsId}
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
