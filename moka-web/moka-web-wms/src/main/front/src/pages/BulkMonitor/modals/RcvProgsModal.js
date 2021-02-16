import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaModal } from '@/components';
import { getBulkStatListInfo } from '@/store/bulks';

const RcvProgsModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();
    const bulkSendListInfo = useSelector((store) => store.bulkMonitor.bulkSendListInfo);
    const [bulkContent, setBulkContent] = useState('');
    const [bulkMsg, setBulkMsg] = useState('');

    const handleHide = () => {
        setBulkContent('');
        setBulkMsg('');
        onHide();
    };

    useEffect(() => {
        if (data && show) {
            if (data.type === 'naver') {
                dispatch(
                    getBulkStatListInfo({
                        totalId: data.contentId,
                        portalDiv: 'NAVER_JA',
                    }),
                );
            } else if (data.type === 'daum') {
                dispatch(
                    getBulkStatListInfo({
                        totalId: data.contentId,
                        portalDiv: 'DAUM_JA',
                    }),
                );
            } else if (data.type === 'nate') {
                dispatch(
                    getBulkStatListInfo({
                        totalId: data.contentId,
                        portalDiv: 'EMPAS_JA',
                    }),
                );
            } else if (data.type === 'zoom') {
                dispatch(
                    getBulkStatListInfo({
                        totalId: data.contentId,
                        portalDiv: 'ESTSOFT',
                    }),
                );
            } else if (data.type === 'kpf') {
                dispatch(
                    getBulkStatListInfo({
                        totalId: data.contentId,
                        portalDiv: 'KPF_JA',
                    }),
                );
            } else {
                return;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, show]);

    useEffect(() => {
        if (bulkSendListInfo.length === 1) {
            setBulkContent(bulkSendListInfo[0].content);
            setBulkMsg(bulkSendListInfo[0].msg);
        }
    }, [bulkSendListInfo]);

    return (
        <MokaModal
            size="md"
            width={400}
            height={600}
            bodyClassName="d-flex flex-column flex-fill"
            show={show}
            onHide={handleHide}
            buttons={[{ variant: 'negative', text: '닫기', onClick: handleHide }]}
        >
            <Form className="d-flex flex-column flex-fill">
                {data.type !== 'status' && (
                    <>
                        <p className="mb-2">생성 XML</p>
                        <MokaInput as="textarea" value={bulkContent} className="mb-2 custom-scroll resize-none" readOnly />
                    </>
                )}
                <p className="mb-2">메세지</p>
                <MokaInput as="textarea" value={data.type !== 'status' ? bulkMsg : data.msg} className="custom-scroll resize-none" readOnly />
            </Form>
        </MokaModal>
    );
};

export default RcvProgsModal;
