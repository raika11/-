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
 * 테이블에 들어가는 preview 버튼
 */
const MokaTablePreviewButton = (props) => {
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
        <Button variant="gray150" className="py-0 px-05" onClick={handleClick}>
            <MokaIcon iconName="fal-file-search" />
        </Button>
    );
};

MokaTablePreviewButton.propTypes = propTypes;
MokaTablePreviewButton.defaultProps = defaultProps;

export default MokaTablePreviewButton;
