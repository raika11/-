import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const propTypes = {
    /**
     * row data
     */
    data: PropTypes.object,
    /**
     * 버튼 클릭 함수
     */
    onClick: PropTypes.func,
};
const defaultProps = {
    data: null,
    onClick: null,
};

/**
 * 테이블에 들어가는 Link 버튼
 */
const MokaTableLinkButton = (props) => {
    const { data, onClick } = props;

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onClick) {
                onClick(data);
            }
        },
        [data, onClick],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <OverlayTrigger overlay={<Tooltip id="tooltip-table-link-button">새창열기</Tooltip>}>
                <Button variant="white" className="border p-0 moka-table-button" onClick={handleClick}>
                    <MokaIcon iconName="fal-external-link" />
                </Button>
            </OverlayTrigger>
        </div>
    );
};

MokaTableLinkButton.propTypes = propTypes;
MokaTableLinkButton.defaultProps = defaultProps;

export default MokaTableLinkButton;
