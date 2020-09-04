import React from 'react';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import { WmsIconButton } from '~/components/WmsButtons';

const ComponentOpenInNewButton = (props) => {
    const { row } = props;

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(row.link);
    };

    return (
        <WmsIconButton title="새창열기" onClick={onClick}>
            <OpenInNewOutlinedIcon />
        </WmsIconButton>
    );
};

export default ComponentOpenInNewButton;
