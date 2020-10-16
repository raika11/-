import React, { useCallback } from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const PagePreviewButton = (props) => {
    const handleClick = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const { data } = props;
            if (data) {
                console.log(data);
            }
            window.open(`${data.pageUrl}`);
        },
        [props],
    );

    return (
        <Button variant="white" onClick={handleClick}>
            <MokaIcon iconName="fal-file-search" />
        </Button>
    );
};

export default PagePreviewButton;
