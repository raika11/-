import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const propTypes = {
    /**
     * button 의 variant
     */
    variant: PropTypes.string,
    /**
     * tooltip text
     */
    tooltipText: PropTypes.string,
    /**
     * tooltip의 id
     */
    tooltipId: PropTypes.string,
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 버튼 클릭 함수
     */
    onClick: PropTypes.func,
};
const defaultProps = {
    onClick: null,
};

/**
 * overlay Tooltip 있는 버튼
 */
const MokaOverlayTooltipButton = (props) => {
    const { children, variant, tooltipText, className, onClick, tooltipId } = props;

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onClick) {
                onClick(e);
            }
        },
        [onClick],
    );

    return (
        <OverlayTrigger overlay={<Tooltip id={tooltipId}>{tooltipText}</Tooltip>}>
            <Button variant={variant} className={className} onClick={handleClick}>
                {children}
            </Button>
        </OverlayTrigger>
    );
};

MokaOverlayTooltipButton.propTypes = propTypes;
MokaOverlayTooltipButton.defaultProps = defaultProps;

export default MokaOverlayTooltipButton;
