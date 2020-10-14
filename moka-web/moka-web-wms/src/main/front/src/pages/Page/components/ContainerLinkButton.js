import React from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const ContainerLinkButton = (props) => {
    return (
        <Button variant="white">
            <MokaIcon iconName="fal-external-link" />
        </Button>
    );
};

export default ContainerLinkButton;
