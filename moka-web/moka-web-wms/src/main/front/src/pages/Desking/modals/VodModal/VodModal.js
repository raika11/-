import React, { useState } from 'react';
import { MokaModal, MokaCardTabs } from '@components';
import LiveList from './LiveList';
import OvpList from './OvpList';

const VodModal = (props) => {
    const { show, onHide, vodUrl, onSave } = props;
    const [activeKey, setActivekey] = useState(0);
    // const [selectedUrl, setSelectedUrl] = useState('');

    return (
        <MokaModal
            width={500}
            height={610}
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
                fill
                onSelectNav={(idx) => setActivekey(Number(idx))}
                tabNavs={['YOUTUBE', 'LIVE', 'OVP']}
                className="w-100 h-100"
                tabs={[<>TEST</>, <LiveList show={show && activeKey === 1} />, <OvpList show={show && activeKey === 2} />]}
            />
        </MokaModal>
    );
};

export default VodModal;
