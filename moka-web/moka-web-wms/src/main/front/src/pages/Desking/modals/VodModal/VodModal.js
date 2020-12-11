import React, { useState, useEffect } from 'react';
import { MokaModal, MokaCardTabs } from '@components';
import LiveList from './LiveList';
import OvpList from './OvpList';

const VodModal = (props) => {
    const { show, onHide, vodUrl, onSave } = props;
    const [activeKey, setActivekey] = useState(0);
    const [videoId, setVideoId] = useState('');
    const [options, setOptions] = useState({});

    const [returnUrl, setReturnUrl] = useState(null);

    useEffect(() => {
        if (vodUrl && vodUrl !== '') {
            const url = new URL(vodUrl);
            setVideoId(url.searchParams.get('viedoId'));
            setOptions({
                autoplay: url.searchParams.get('options[autoplay]') === 'true',
                muteFirstPlay: url.searchParams.get('options[muteFirstPlay]') === 'true',
                loop: url.searchParams.get('options[loop]') === 'true',
            });
        } else {
            setVideoId('');
            setOptions({});
        }
    }, [vodUrl]);

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
                { text: '취소', onClick: onHide, variant: 'negative' },
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
                tabs={[
                    <>TEST</>,
                    <LiveList show={show && activeKey === 1} videoId={videoId} options={options} setReturnUrl={setReturnUrl} />,
                    <OvpList show={show && activeKey === 2} videoId={videoId} options={options} setReturnUrl={setReturnUrl} />,
                ]}
            />
        </MokaModal>
    );
};

export default VodModal;
