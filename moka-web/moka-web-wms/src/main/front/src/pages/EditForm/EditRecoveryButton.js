import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { messageBox } from '@utils/toastUtil';

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
const EditButton = (props) => {
    const { data, onClick } = props;

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            messageBox.confirm(
                '이전에 저장한 내용을 불러오시겠습니까?\n불러온 후 임시저장을 하셔야 적용이 됩니다.',
                () => {
                    if (onClick) {
                        onClick(data);
                    }
                },
                () => {},
            );
        },
        [data, onClick],
    );

    return (
        <>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="outline-neutral" size="sm" onClick={handleClick}>
                    복구
                </Button>
            </div>
        </>
    );
};

EditButton.propTypes = propTypes;
EditButton.defaultProps = defaultProps;

export default EditButton;
