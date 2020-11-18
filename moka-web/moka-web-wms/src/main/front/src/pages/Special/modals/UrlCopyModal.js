import React from 'react';
import { MokaModal, MokaInput } from '@components';

const UrlCopyModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="URL 복사"
            width={440}
            buttons={[
                {
                    text: '확인',
                    variant: 'positive',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <div className="pt-3 pl-5">
                <p>Ctrl + C를 누르면 복사할 수 있습니다.</p>
            </div>
            <MokaInput />
        </MokaModal>
    );
};

export default UrlCopyModal;
