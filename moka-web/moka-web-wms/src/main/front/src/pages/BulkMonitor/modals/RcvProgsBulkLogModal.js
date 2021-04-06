import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaInputLabel, MokaModal, MokaTable } from '@/components';
import { DB_DATEFORMAT } from '@/constants';
import columnDefs from './RcvProgsBulkLogAgGridColumns';
import { GET_BULK_STAT_LIST_INFO, getBulkStatListInfo } from '@/store/bulks';

/**
 * 벌크 전송 상세 모달
 */
const RcvProgsBulkLogModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [rcvProgs, setRcvProgs] = useState(false);
    const [type, setType] = useState('');
    const [bulkContent, setBulkContent] = useState('');
    const [bulkMsg, setBulkMsg] = useState('');
    const bulkSendListInfo = useSelector((store) => store.bulkMonitor.bulkSendListInfo);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_LIST_INFO]);

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRcvProgs(false);
        setBulkContent('');
        setRowData([]);
        setType('');
        setBulkMsg('');
        onHide();
    };

    const handleClickStatus = () => {
        setRcvProgs(true);
        setType('btn');
    };

    /**
     * 목록 Row 클릭
     */
    const handleRowClicked = useCallback((data) => {
        setRcvProgs(true);
        setType('');
        setBulkContent(data.content);
        setBulkMsg(data.msg);
    }, []);

    useEffect(() => {
        // 모달 show, data 존재할 시 벌크 상세 정보 조회
        if (data && show) {
            dispatch(
                getBulkStatListInfo({
                    totalId: data.contentId,
                    portalDiv: null,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, show]);

    useEffect(() => {
        // startDt, endDt 모멘트 객체로
        setRowData(
            bulkSendListInfo.map((data, idx) => ({
                ...data,
                seq: idx,
                startDt: moment(data.startDt).format(DB_DATEFORMAT),
                endDt: moment(data.endDt).format(DB_DATEFORMAT),
            })),
        );
    }, [bulkSendListInfo]);

    return (
        <MokaModal size="xl" width={rcvProgs === false ? 700 : 1120} height={850} show={show} onHide={handleHide} draggable>
            <div className="d-flex justify-content-between">
                <div style={{ width: 700 }}>
                    <Form className="mb-14">
                        <MokaInputLabel className="mb-2" label="기사 ID" value={data.contentId} inputProps={{ readOnly: true, plaintext: true }} />
                        <MokaInputLabel className="mb-2" label="제목" value={data.title} inputProps={{ readOnly: true, plaintext: true }} />
                        <Form.Row className="d-flex justify-content-between mb-2">
                            <MokaInputLabel label="매체" value={data.orgSourceName} inputProps={{ readOnly: true, plaintext: true }} />
                        </Form.Row>
                        <div className="d-flex align-items-center">
                            <MokaInputLabel as="none" label="상태" />
                            <MokaInput className="cursor-pointer" value={data.status} onClick={handleClickStatus} readOnly plaintext />
                        </div>
                    </Form>
                    <div className="d-flex flex-column">
                        <MokaTable
                            agGridHeight={577}
                            columnDefs={columnDefs}
                            rowData={rowData}
                            loading={loading}
                            onRowNodeId={(params) => params.seq}
                            onRowClicked={handleRowClicked}
                            paging={false}
                        />
                    </div>
                </div>
                {rcvProgs === true && (
                    <div className="ml-gutter d-flex flex-column" style={{ width: 420 }}>
                        {type !== 'btn' && (
                            <>
                                <p className="mb-2">생성 XML</p>
                                <MokaInput as="textarea" value={bulkContent} className="mb-2 custom-scroll resize-none" readOnly inputProps={{ rows: 15 }} />
                            </>
                        )}
                        <p className="mb-2">메세지</p>
                        <MokaInput as="textarea" value={type === 'btn' ? data.msg : bulkMsg} className="custom-scroll resize-none" readOnly inputProps={{ rows: 16 }} />
                    </div>
                )}
            </div>
        </MokaModal>
    );
};

export default RcvProgsBulkLogModal;
