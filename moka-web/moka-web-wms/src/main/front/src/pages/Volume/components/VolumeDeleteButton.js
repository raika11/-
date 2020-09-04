import React, { useState } from 'react';
import { WmsIconButton } from '~/components';
import DeleteDialog from '../dialog/DeleteDialog';

const VolumeDeleteButton = ({ row }) => {
    const [delOpen, setDelOpen] = useState(false);

    // 볼륨 삭제
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDelOpen(true);
    };

    return (
        <>
            <WmsIconButton icon="remove_circle" onClick={onClick} />
            <DeleteDialog
                open={delOpen}
                onClose={() => setDelOpen(false)}
                volumeId={row.volumeId}
                volumeName={row.volumeName}
            />
        </>
    );
};

export default VolumeDeleteButton;
