import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const propTypes = {
    data: PropTypes.object,
};

const defaultProps = {
    data: null,
};

/**
 * 기자 검색 모달 AgGrid 조회 버튼
 */
const ReporterModalAddButton = (props) => {
    const { data } = props;

    const handleClick = useCallback((data) => {
        if (data.onClickSave) {
            data.onClickSave(data, data.handleHide);
        }
    }, []);

    return (
        <>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="positive" size="sm" onClick={() => handleClick(data)}>
                    등록
                </Button>
            </div>
        </>
    );
};

ReporterModalAddButton.propTypes = propTypes;
ReporterModalAddButton.defaultProps = defaultProps;

export default ReporterModalAddButton;
