import React, { useCallback } from 'react';
import DeleteDialog from './DeleteDialog';
import { WmsIconButton } from '~/components';

const ContainerListDeleteButton = ({ row }) => {
    const [open, setOpen] = React.useState(false);

    // 컨테이너 삭제
    const onClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    }, []);

    return (
        <>
            <WmsIconButton icon="remove_circle" onClick={onClick} />
            {open && (
                <DeleteDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    containerSeq={row.containerSeq}
                    containerName={row.containerName}
                />
            )}
        </>
    );
};

export default ContainerListDeleteButton;
