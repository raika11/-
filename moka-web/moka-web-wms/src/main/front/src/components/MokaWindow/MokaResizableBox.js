import React from 'react';
import { ResizableBox } from 'react-resizable';

const MokaResizableBox = (props) => {
    const { children, ...rest } = props;

    return <ResizableBox {...rest}>{children}</ResizableBox>;
};

export default MokaResizableBox;
