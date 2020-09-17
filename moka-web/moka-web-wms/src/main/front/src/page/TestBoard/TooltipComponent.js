import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

const TooltipComponent = (props) => {
    const { placement, id, content, buttonTitle, variant, className, ...rest } = props;

    return (
        <OverlayTrigger
            placement={placement}
            overlay={
                <Tooltip id={id}>
                    <div>{content}</div>
                </Tooltip>
            }
            {...rest}
        >
            <Button variant={variant} className={className}>
                {buttonTitle}
            </Button>
        </OverlayTrigger>
    );
};

export default TooltipComponent;
