import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CHANNEL_TYPE, ISSUE_CHANNEL_TYPE, ARTICLE_URL } from '@/constants';
import { initialState } from '@store/issue';
import { MokaInputLabel, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { ArticleTabModal } from '@pages/Article/modals';
import { liveColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 라이브기사
 */
const CollapseLive = ({ pkgSeq, compNo, gridInstance, setGridInstance }) => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const controls = 'collapse-live';

    /**
     * 기사 선택
     * @param {string} channelType channelType
     * @param {object} data data
     */
    const addArticle = (channelType, data) => {
        if (channelType === CHANNEL_TYPE.A.code) {
            const cnt = gridInstance.api.getDisplayedRowCount();
            const ndata = {
                ...initialState,
                pkgSeq,
                compNo,
                title: data.artTitle,
                linkUrl: `${ARTICLE_URL}${data.totalId}`,
                channelType: ISSUE_CHANNEL_TYPE.L.code,
            };
            if (cnt < 1) {
                gridInstance.api.setRowData([ndata]);
                setShow(false);
            } else {
                messageBox.confirm(
                    '라이브 기사 등록은 1개만 등록 가능합니다.\n등록된 기사를 삭제 후 등록하시겠습니까?',
                    () => {
                        gridInstance.api.setRowData([ndata]);
                        setShow(false);
                    },
                    () => {},
                );
            }
        } else {
            messageBox.alert('기사를 선택해주세요.');
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
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={addArticle} />
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
                        onRowNodeId={(data) => data.contentsId}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </>
    );
};

export default CollapseLive;
