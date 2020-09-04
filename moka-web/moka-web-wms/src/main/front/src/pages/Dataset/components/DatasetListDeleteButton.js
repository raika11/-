import React, { useCallback } from 'react';
import DeleteDialog from './DeleteDialog';
import { WmsIconButton } from '~/components';

const DatasetListDeleteButton = ({ row }) => {
    const [open, setOpen] = React.useState(false);

    // 데이타셋 삭제
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
                    datasetSeq={row.datasetSeq}
                    datasetName={row.datasetName}
                />
            )}
        </>
    );
};

export default DatasetListDeleteButton;
