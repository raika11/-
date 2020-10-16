import React, { useCallback } from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const ComponentLinkButton = (props) => {
    const handleClick = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const { data } = props;
            if (data) {
                console.log(data);
                window.open(`/component/${data.componentSeq}`);
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

export default ComponentLinkButton;
