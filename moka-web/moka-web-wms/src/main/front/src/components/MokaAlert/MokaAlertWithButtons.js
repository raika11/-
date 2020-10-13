import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const propTypes = {
    /**
     * variant
     */
    variant: PropTypes.string,
    /**
     * outline
     */
    outline: PropTypes.bool,
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 버튼 리스트
     */
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            className: PropTypes.string,
            onClick: PropTypes.func,
            text: PropTypes.string,
        }),
    ),
    /**
     * 타이틀
     */
    title: PropTypes.string,
    /**
     * dismissible
     */
    dismissible: PropTypes.bool,
    /**
     * dismissible이 true일 때 onClick 필수
     */
    onClose: PropTypes.func,
    /**
     * children
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
const defaultProps = {
    variant: 'primary',
    buttons: [],
    outline: true,
    dismissible: true,
};

/**
 * 밑에 버튼 나오는 Alert
 */
const MokaAlertWithButtons = forwardRef((props, ref) => {
    const { variant, outline, className, buttons, title, dismissible, onClose, children, ...rest } = props;

    // alert state
    const [show, setShow] = useState(true);

    /**
     * 닫기 버튼
     */
    const handleClose = () => {
        if (onClose) onClose();
        setShow(false);
    };

    if (show) {
        return (
            <Alert
                ref={ref}
                className={clsx(className, {
                    'alert-outline': outline,
                })}
                variant={variant}
                dismissible={dismissible}
                onClose={handleClose}
                {...rest}
            >
                <div className="alert-message">
                    {title && <Alert.Heading>{title}</Alert.Heading>}
                    {children}
                    <hr />
                    <div className="btn-list">
                        {buttons.map((buttonProps, idx) => {
                            const { variant: buttonVariant, className: buttonClassName, text: buttonText, onClick: buttonOnClick } = buttonProps;
                            return (
                                <Button key={`alert-button-${idx}`} variant={buttonVariant} className={clsx('mr-1', buttonClassName)} onClick={buttonOnClick}>
                                    {buttonText}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </Alert>
        );
    } else {
        return null;
    }
});

MokaAlertWithButtons.propTypes = propTypes;
MokaAlertWithButtons.defaultProps = defaultProps;

export default MokaAlertWithButtons;
