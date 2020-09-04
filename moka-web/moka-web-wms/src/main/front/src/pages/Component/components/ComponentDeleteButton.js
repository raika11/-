import React, { useState } from 'react';
import { WmsIconButton } from '~/components';
import DeleteDialog from '../dialog/DeleteDialog';

const ComponentDeleteButton = (props) => {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(true);
    };

    return (
        <>
            <WmsIconButton icon="remove_circle" onClick={onClick} />
            <DeleteDialog
                open={open}
                onClose={() => setOpen(false)}
                componentSeq={row.componentSeq}
                componentName={row.componentName}
            />
        </>
    );
};

export default ComponentDeleteButton;
