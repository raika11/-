import React from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const ContainerAppendButton = (props) => {
    return (
        <Button variant="white">
            <MokaIcon iconName="fal-file-plus" />
        </Button>
    );
};

export default ContainerAppendButton;
