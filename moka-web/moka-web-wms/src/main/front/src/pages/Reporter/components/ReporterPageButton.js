import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
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
 * 기자관리 리스트 테이블의 새창열기 페이지
 */
const ReporterPageButton = (props) => {
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
                <Button variant="gray150" size="sm" onClick={handleClick}>
                    기자 페이지
                </Button>
            </div>
        </>
    );
};

ReporterPageButton.propTypes = propTypes;
ReporterPageButton.defaultProps = defaultProps;

export default ReporterPageButton;
