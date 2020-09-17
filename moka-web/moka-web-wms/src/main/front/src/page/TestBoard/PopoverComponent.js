import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

const PopoverComponent = (props) => {
    const { id, placement, title, content, buttonTitle, variant, className, ...rest } = props;

    return (
        <OverlayTrigger
            trigger="click"
            placement={placement}
            overlay={
                <Popover id={id}>
                    <Popover.Title as="h3">{title}</Popover.Title>
                    <Popover.Content>
                        <div>{content}</div>
                    </Popover.Content>
                </Popover>
            }
            {...rest}
        >
            <Button variant={variant} className={className}>
                {buttonTitle}
            </Button>
        </OverlayTrigger>
    );
};

export default PopoverComponent;
