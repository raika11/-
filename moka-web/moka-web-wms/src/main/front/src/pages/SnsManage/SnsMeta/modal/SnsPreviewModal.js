import React from 'react';
import { MokaCardTabs, MokaModal } from '@components';
import { ARTICLE_URL } from '@/constants';

const SnsPreviewModal = ({ show, onHide, totalId }) => {
    return (
        <MokaModal
            title="기사보기"
            show={show}
            onHide={onHide}
            width={1200}
            height={860}
            size="xl"
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            draggable
            centered
        >
            <MokaCardTabs
                height={700}
                className="shadow-none w-100"
                tabs={[
                    <React.Fragment>
                        <div className="px-3 py-2">
                            <iframe src={`${ARTICLE_URL}${totalId}`} title={totalId} style={{ border: 'none', height: '600px', width: '100%' }} />
                        </div>
                    </React.Fragment>,
                    <React.Fragment>
                        <div className="px-3 py-2">
                            <iframe src={`${ARTICLE_URL}${totalId}`} title={totalId} style={{ border: 'none', height: '600px', width: '100%' }} />
                        </div>
                    </React.Fragment>,
                ]}
                tabNavs={['웹 미리보기', '모바일 미리보기']}
                fill
            />
        </MokaModal>
    );
};

export default SnsPreviewModal;
