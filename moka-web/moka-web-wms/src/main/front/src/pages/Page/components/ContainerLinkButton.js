import React, { useCallback } from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const ContainerLinkButton = (props) => {
    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            const { data } = props;
            if (data) {
                console.log(data);
            }
        },
        [props],
    );

    return (
        <Button variant="white" onClick={handleClick}>
            <MokaIcon iconName="fal-external-link" />
        </Button>
    );
};

export default ContainerLinkButton;
