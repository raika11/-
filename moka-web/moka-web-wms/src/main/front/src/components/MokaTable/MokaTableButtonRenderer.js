import React, { useImperativeHandle, forwardRef } from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon } from '@components';
import util from '@utils/commonUtil';

const OverlayWrapper = ({ children, overlayText }) => (
    <OverlayTrigger overlay={<Tooltip id={`btn-renderer-${util.getUniqueKey()}`}>{overlayText}</Tooltip>}>{children}</OverlayTrigger>
);

const defaultProps = {
    iconButton: false,
};

/**
 * Button Renderer
 * 버튼명 : text가 있을 경우 text 노출, 없으면 field 노출
 * 클릭 함수 : clickFunctionName이 있을 경우 그 명칭에 해당하는 함수 실행, 없으면 onClick 실행
 */
const MokaTableButton = forwardRef((params, ref) => {
    const { text, clickFunctionName, variant, iconButton, iconName, overlayText } = params;

    const render = () => (
        <Button
            variant={variant ? variant : iconButton ? 'white' : 'outline-table-btn'}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (clickFunctionName && params.node.data[clickFunctionName]) {
                    params.node.data[clickFunctionName].call(this, params.node.data);
                    // Function.prototype.call(params.node.data[clickFunctionName], params.node.data);
                } else if (params.node.data.onClick) {
                    params.node.data.onClick(params.node.data);
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
