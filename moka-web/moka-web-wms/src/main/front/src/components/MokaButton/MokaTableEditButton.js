import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

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
 * 테이블에 들어가는 edit 버튼
 */
const MokaTableEditButton = (props) => {
    const { data, onStartEditing, onEndEditing } = props;
    const [editing, setEditing] = useState(false);

    const handleStartEditing = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onStartEditing) {
                onStartEditing(props);
                setEditing(true);
            }
        },
        [onStartEditing, props],
    );

    const handleStopEditing = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onEndEditing) {
                onEndEditing(props);
                setEditing(false);
            }
        },
        [onEndEditing, props],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">제목수정</Tooltip>}>
                <Button variant="white" className="border-0 p-0 moka-table-button bg-transparent" onClick={editing ? handleStopEditing : handleStartEditing}>
                    <MokaIcon iconName={editing ? 'fal-save' : 'fal-pencil'} />
                </Button>
            </OverlayTrigger>
        </div>
    );
};

MokaTableEditButton.propTypes = propTypes;
MokaTableEditButton.defaultProps = defaultProps;

export default MokaTableEditButton;
