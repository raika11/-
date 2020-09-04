import React from 'react';
import { WmsIconButton } from '~/components/WmsButtons';
import DeleteDialog from '../dialog/DeleteDialog';

/**
 * 템플릿 row의 삭제 버튼
 */
const TemplateDeleteButton = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const onClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            <WmsIconButton icon="remove_circle" onClick={onClose} />
            <DeleteDialog
                open={open}
                onClose={() => setOpen(false)}
                templateSeq={row.templateSeq}
                templateName={row.templateName}
            />
        </>
    );
};

export default TemplateDeleteButton;
