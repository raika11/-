import React from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';

const TemplateDeleteButton = (props) => {
    const { data } = props;

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        toastr.confirm(`${data.templateSeq}_${data.templateName}을 삭제하시겠습니까?`, {
            onOk: () => console.log('OK: clicked'),
            onCancel: () => console.log('CANCEL: clicked'),
        });
    };

    return (
        <Button variant="white" className="py-0 px-05" onClick={handleClick}>
            <MokaIcon iconName="fal-minus-square" />
        </Button>
    );
};

export default TemplateDeleteButton;
