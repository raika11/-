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
 * 기타코드관리 리스트 테이블의 edit 버튼
 */
const CodeMgtEditButton = (props) => {
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
        <>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="white" className="border-0 p-0 moka-table-button bg-transparent" onClick={handleClick}>
                    <MokaIcon iconName="fal-pencil" />
                </Button>
            </div>
        </>
    );
};

CodeMgtEditButton.propTypes = propTypes;
CodeMgtEditButton.defaultProps = defaultProps;

export default CodeMgtEditButton;
