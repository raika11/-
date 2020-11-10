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
};

/**
 * 기자 검색 모달 AgGrid 등록 버튼
 */
const ReporterModalAddButton = (props) => {
    // const { data, onClick } = props;
    const [showModal, setShowModal] = useState(false);

    // const handleClick = useCallback(
    //     (e) => {
    //         e.stopPropagation();
    //         e.preventDefault();

    //         if (onClick) {
    //             onClick(data);
    //             setShowModal(true);
    //         }
    //     },
    //     [data, onClick],
    // );

    return (
        <>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
                    등록
                </Button>
            </div>
        </>
    );
};

ReporterModalAddButton.propTypes = propTypes;
ReporterModalAddButton.defaultProps = defaultProps;

export default ReporterModalAddButton;
