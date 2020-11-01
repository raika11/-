/* eslint-disable no-useless-escape */
import React from 'react';
import { MokaModalEditor } from '@components';

const ContainerHtmlModal = (props) => {
    const { show, onHide, title, containerBody } = props;

    const handleSave = () => {
        onHide();
    };

    return (
        <MokaModalEditor
            title={title}
            show={show}
            onHide={onHide}
            defaultValue={containerBody}
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleSave },
                { text: '닫기', variant: 'gray150', onClick: onHide },
            ]}
            options={{
                readOnly: false,
            }}
        />
    );
};

export default ContainerHtmlModal;
