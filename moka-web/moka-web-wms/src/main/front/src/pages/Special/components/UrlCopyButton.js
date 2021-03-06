import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import UrlCopyModal from '../modals/UrlCopyModal';

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
 * 디지털 스페셜 리스트 테이블의 URL 복사 버튼
 */
const UrlCopyButton = (props) => {
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
                <Button variant="outline-table-btn" size="sm" onClick={() => setShowModal(true)}>
                    URL 복사
                </Button>
            </div>
            <UrlCopyModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

UrlCopyButton.propTypes = propTypes;
UrlCopyButton.defaultProps = defaultProps;

export default UrlCopyButton;
