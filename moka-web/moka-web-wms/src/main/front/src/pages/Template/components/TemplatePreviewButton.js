import React from 'react';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';
import { WmsIconButton } from '~/components/WmsButtons';

const TemplatePreviewButton = (props) => {
    const { row } = props;

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(row.previewUrl);
    };

    return (
        <WmsIconButton title="미리보기" onClick={onClick}>
            <PageviewOutlinedIcon />
        </WmsIconButton>
    );
};

export default TemplatePreviewButton;
