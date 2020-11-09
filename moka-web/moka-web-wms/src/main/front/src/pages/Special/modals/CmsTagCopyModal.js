import React from 'react';
import { MokaModal, MokaInput } from '@components';

const CmsTagCopyModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="CMS용 태그 복사"
            width={440}
            buttons={[
                {
                    text: '확인',
                    variant: 'primary',
                    onClick: onHide,
                },
                {
                    text: '취소',
                    variant: 'gray150',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <div className="pt-3 pl-5">
                <p>
                    CMS 기사용 자동 리다이렉트 태그가 클립보드에 복사되었습니다.
                    <br />
                    Ctrl + C를 누르면 복사할 수 있습니다.
                </p>
            </div>
            <MokaInput />
        </MokaModal>
    );
};

export default CmsTagCopyModal;
