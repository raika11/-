import React, { useState } from 'react';
import { MokaModal, MokaCardTabs } from '@components';
import LiveList from './LiveList';

const VodModal = (props) => {
    const { show, onHide, vodUrl, onSave } = props;
    const [activeKey, setActivekey] = useState(0);
    const [selectedUrl, setSelectedUrl] = useState('');

    return (
        <MokaModal
            width={460}
            height={500}
            title="동영상 URL 선택"
            show={show}
            onHide={onHide}
            footerClassName="d-flex justify-content-center"
            bodyClassName="p-0"
            buttons={[
                { text: '등록', onClick: onSave, variant: 'positive' },
                { text: '취소', onClick: () => {}, variant: 'negative' },
            ]}
            id="vod"
            centered
            draggable
        >
            <MokaCardTabs
                onSelectNav={(idx) => setActivekey(Number(idx))}
                tabNavs={['YOUTUBE', 'LIVE', 'OVP']}
                fill
                tabs={[<>TEST</>, <LiveList show={show && activeKey === 1} />]}
            />
        </MokaModal>
    );
};

export default VodModal;
