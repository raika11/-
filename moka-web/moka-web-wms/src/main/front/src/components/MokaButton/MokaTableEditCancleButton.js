import React from 'react';
import PropTypes from 'prop-types';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';

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
 * 테이블에 들어가는 edit 취소 + 삭제 버튼
 */
const MokaTableEditCancleButton = (props) => {
    const { editing, onClick } = props;

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <MokaOverlayTooltipButton
                tooltipId="tooltip-table-editc-button"
                tooltipText={editing ? '취소' : '삭제'}
                variant="white"
                className="border-0 p-0 moka-table-button bg-transparent shadow-none"
                onClick={onClick}
            >
                <MokaIcon iconName={editing ? 'fas-times' : 'fas-minus-circle'} />
            </MokaOverlayTooltipButton>
        </div>
    );
};

MokaTableEditCancleButton.propTypes = propTypes;
MokaTableEditCancleButton.defaultProps = defaultProps;

export default MokaTableEditCancleButton;
