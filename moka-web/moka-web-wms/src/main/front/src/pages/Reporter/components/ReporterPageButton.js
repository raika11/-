import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

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
    const { data } = props;
    const dispatch = useDispatch();

    const [btnDisabled, setBtnDisabled] = useState(true);

    useEffect(() => {
        if (data.usedYn === 'Y') {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [data.usedYn, dispatch]);

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            window.open('https://news.joins.com/reporter/' + data.repSeq, '_blank');
        },
        [data],
    );

    return (
        <>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="outline-table-btn" size="sm" onClick={handleClick} disabled={btnDisabled}>
                    기자 페이지
                </Button>
            </div>
        </>
    );
};

ReporterPageButton.propTypes = propTypes;
ReporterPageButton.defaultProps = defaultProps;

export default ReporterPageButton;
