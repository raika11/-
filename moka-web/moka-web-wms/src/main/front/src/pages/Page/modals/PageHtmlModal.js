/* eslint-disable no-useless-escape */
import React from 'react';
import { MokaModalEditor } from '@components';

const PageHtmlModal = (props) => {
    const { show, onHide, title, pageBody } = props;

    return (
        <MokaModalEditor
            title={title}
            show={show}
            onHide={onHide}
            defaultValue={pageBody}
            buttons={[{ text: '닫기', variant: 'gray150', onClick: onHide }]}
            options={{
                readOnly: true,
            }}
        />
    );
};

export default PageHtmlModal;
