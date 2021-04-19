import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ISSUE_CHANNEL_TYPE } from '@/constants';
import { initialState } from '@store/issue';
import { MokaInputLabel, MokaTable } from '@components';
import { bannerColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 배너
 */
const CollapseBanner = ({ compNo, gridInstance, pkgSeq, setGridInstance, desking, deskingList }) => {
    const controls = 'collapse-banner';
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const data =
            deskingList.length > 0
                ? {
                      ...initialState.initialDesking,
                      ...deskingList[0],
                      pkgSeq,
                      compNo,
                      channelType: ISSUE_CHANNEL_TYPE.B.code,
                      id: 'banner-1',
                  }
                : {
                      ...initialState.initialDesking,
                      pkgSeq,
                      compNo,
                      channelType: ISSUE_CHANNEL_TYPE.B.code,
                      id: 'banner-1',
                  };
        if (gridInstance) gridInstance.api.setRowData([data]);
    }, [compNo, deskingList, gridInstance, pkgSeq]);

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    return (
        <>
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel as="switch" label="배너" id={controls} inputProps={{ checked: open }} onChange={(e) => setOpen(e.target.checked)} />
                </Col>
                <Col xs={4}></Col>
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
                        columnDefs={bannerColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </>
    );
};

export default CollapseBanner;
