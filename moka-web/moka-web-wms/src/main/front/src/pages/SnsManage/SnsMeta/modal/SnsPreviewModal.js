import React from 'react';
import { MokaCardTabs, MokaModal } from '@components';

const SnsPreviewModal = ({ show, onHide, totalId }) => {
    return (
        <MokaModal
            title="대표 이미지 편집"
            show={show}
            onHide={onHide}
            width={1200}
            height={860}
            size="xl"
            buttons={[
                { text: '등록', variant: 'positive' },
                { text: '취소', variant: 'negative' },
            ]}
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            draggable
            centered
        >
            <MokaCardTabs
                height={740}
                className="shadow-none w-100"
                tabs={[
                    <React.Fragment>
                        <div className="px-3 py-2">
                            <iframe src={`https://news.joins.com/article/${totalId}`} style={{ display: 'block', border: 'none', height: '100vh', width: '100vw' }} />
                        </div>
                    </React.Fragment>,
                    <React.Fragment>
                        <div className="px-3 py-2">
                            <iframe src={`https://mnews.joins.com/article/${totalId}`} style={{ display: 'block', border: 'none', height: '100vh', width: '100vw' }} />
                        </div>
                    </React.Fragment>,
                ]}
                tabNavs={['PC', 'Mobile']}
                fill
            />
        </MokaModal>
    );
};

export default SnsPreviewModal;
