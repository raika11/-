import React, { useState, useEffect } from 'react';
import { MokaModal } from '@/components';
import { MokaEditorCore } from '@/components/MokaEditor';

/**
 * 스케줄 서버 관리 > 작업 목록 > 생성 내용 보기 모달
 */
const JobContentModal = (props) => {
    const { show, onHide, content } = props;
    const [data, setData] = useState('');

    /**
     * 취소
     */
    const handleClickHide = () => {
        setData({});
        onHide();
    };

    useEffect(() => {
        if (content) {
            setData(content || '');
        }
    }, [content]);

    return (
        <MokaModal
            size="lg"
            title="생성 내용"
            show={show}
            onHide={handleClickHide}
            bodyClassName="d-flex flex-column"
            width={900}
            height={800}
            buttons={[{ text: '취소', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            <div className="flex-fill input-border overflow-hidden">
                <MokaEditorCore defaultValue={content} value={data} onBlur={(value) => setData(value)} />
            </div>
        </MokaModal>
    );
};

export default JobContentModal;
