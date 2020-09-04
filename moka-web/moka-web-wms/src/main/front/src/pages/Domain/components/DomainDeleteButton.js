import React, { useState } from 'react';
import { WmsIconButton } from '~/components';
import { DeleteDialog } from '../dialog';

const DomainDeleteButton = ({ row }) => {
    const [open, setOpen] = useState(false);

    // 도메인 삭제
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            <WmsIconButton icon="remove_circle" onClick={onClick} />
            <DeleteDialog
                open={open}
                onClose={() => setOpen(false)}
                domainId={row.domainId}
                domainName={row.domainName}
            />
        </>
    );
};

export default DomainDeleteButton;
