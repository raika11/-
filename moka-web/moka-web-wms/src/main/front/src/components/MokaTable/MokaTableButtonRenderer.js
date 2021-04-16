import React, { useImperativeHandle, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon } from '@components';
import util from '@utils/commonUtil';

const OverlayWrapper = ({ children, overlayText }) => (
    <OverlayTrigger overlay={<Tooltip id={`btn-renderer-${util.getUniqueKey()}`}>{overlayText}</Tooltip>}>{children}</OverlayTrigger>
);

const propTypes = {
    /**
     * 아이콘 버튼 유무
     * @default
     */
    iconButton: PropTypes.bool,
    /**
     * 아이콘명
     */
    iconName: PropTypes.string,
    /**
     * 오버레이 텍스트
     */
    overlayText: PropTypes.string,
    /**
     * 클릭 시 실행할 함수의 명칭 (data 안에 함수가 포함된 경우, 없을 경우 'onClick' 명칭의 함수를 실행)
     * @default
     */
    clickFunctionName: PropTypes.string,
    /**
     * 클릭 시 실행할 함수 (순서 onClick 체크 => clickFunctionName 체크)
     */
    onClick: PropTypes.func,
};

const defaultProps = {
    iconButton: false,
    clickFunctionName: 'onClick',
};

/**
 * Button Renderer
 * 버튼명 : text가 있을 경우 text 노출, 없으면 field 노출
 * 클릭 함수 : clickFunctionName이 있을 경우 그 명칭에 해당하는 함수 실행, 없으면 onClick 실행
 */
const MokaTableButton = forwardRef((params, ref) => {
    const { text, clickFunctionName, onClick, variant, iconButton, iconName, overlayText } = params;

    const render = () => (
        <Button
            variant={variant ? variant : iconButton ? 'white' : 'outline-table-btn'}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (onClick) {
                    onClick.call(this, params.node.data);
                } else if (params.node.data[clickFunctionName]) {
                    params.node.data[clickFunctionName].call(this, params.node.data);
                }
            }}
            className={clsx({
                'p-0': iconButton,
                'moka-table-button': iconButton,
            })}
            size="sm"
        >
            {iconButton ? <MokaIcon iconName={iconName} /> : text ? text : params.colDef.field === 'add' ? '등록' : params.colDef.field}
        </Button>
    );
    useImperativeHandle(ref, () => ({
        refresh: () => true,
    }));

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            {overlayText ? <OverlayWrapper overlayText={overlayText}>{render()}</OverlayWrapper> : render()}
        </div>
    );
});

MokaTableButton.defaultProps = defaultProps;

export default MokaTableButton;
