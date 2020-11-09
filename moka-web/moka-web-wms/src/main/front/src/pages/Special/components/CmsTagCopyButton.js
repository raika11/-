import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import CmsTagCopyModal from '../modals/CmsTagCopyModal';

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
 * 디지털 스페셜 리스트 테이블의 cms용 태그 복사 버튼
 */
const CmsTagCopyButton = (props) => {
    const { data, onClick } = props;
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
                <Button variant="gray150" size="sm" onClick={() => setShowModal(true)}>
                    CMS용 태그 복사
                </Button>
            </div>
            <CmsTagCopyModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

CmsTagCopyButton.propTypes = propTypes;
CmsTagCopyButton.defaultProps = defaultProps;

export default CmsTagCopyButton;
