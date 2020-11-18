import React from 'react';
import { MokaModal, MokaInputLabel } from '@components';

const UrlConfirmModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="URL 확인"
            width={446}
            buttons={[
                {
                    text: '닫기',
                    variant: 'negative',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <div className="pt-3">
                <MokaInputLabel label="URL" value={null} name="url" />
                <MokaInputLabel label="PC URL" value={null} name="pcUrl" />
                <MokaInputLabel label="모바일 URL" value={null} name="mobileUrl" />
            </div>
        </MokaModal>
    );
};

export default UrlConfirmModal;
