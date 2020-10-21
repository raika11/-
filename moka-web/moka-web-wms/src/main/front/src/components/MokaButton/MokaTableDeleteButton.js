import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

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
const MokaTableDeleteButton = (props) => {
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
            <Button variant="white" className="border p-0 moka-table-button" onClick={handleClick}>
                <MokaIcon iconName="fal-minus" />
            </Button>
        </div>
    );
};

MokaTableDeleteButton.propTypes = propTypes;
MokaTableDeleteButton.defaultProps = defaultProps;

export default MokaTableDeleteButton;
