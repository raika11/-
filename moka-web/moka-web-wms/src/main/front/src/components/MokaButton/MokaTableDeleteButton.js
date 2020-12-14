import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
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
 * 테이블에 들어가는 delete 버튼
 */
const MokaTableDeleteButton = forwardRef((props, ref) => {
    const { data, onClick } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

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
            <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">삭제</Tooltip>}>
                <Button variant="white" className="border-0 p-0 moka-table-button bg-transparent shadow-none" onClick={handleClick}>
                    <MokaIcon iconName="fal-minus-circle" />
                </Button>
            </OverlayTrigger>
        </div>
    );
});

MokaTableDeleteButton.propTypes = propTypes;
MokaTableDeleteButton.defaultProps = defaultProps;

export default MokaTableDeleteButton;
