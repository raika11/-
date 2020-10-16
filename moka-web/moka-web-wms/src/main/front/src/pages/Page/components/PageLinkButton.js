import React, { useCallback } from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const PageLinkButton = (props) => {
    const handleClick = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const { data } = props;
            if (data) {
                console.log(data);
            }
            window.open(`/page/${data.pageSeq}`);
        },
        [props],
    );

    return (
        <Button variant="white" onClick={handleClick}>
            <MokaIcon iconName="fal-external-link" />
        </Button>
    );
};

export default PageLinkButton;
