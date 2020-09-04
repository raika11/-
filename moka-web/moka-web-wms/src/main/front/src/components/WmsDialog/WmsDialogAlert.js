import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import { WmsButton, WmsIconButton } from '~/components';
import style from '~/assets/jss/components/WmsDialog/WmsDialogAlertStyle';

const useStyle = makeStyles(style);

/**
 * dialog 형태의 alert
 */
const WmsDialogAlert = (props) => {
    const {
        type,
        title,
        titleCloseButton,
        children,
        open,
        buttons,
        delay,
        onClose,
        okCallback,
        dialogProps,
        overrideClassName
    } = props;
    const classes = useStyle();

    /**
     * 액션 버튼 생성 함수
     */
    const renderActions = () => {
        let actionButtons = [];
        if (!buttons) {
            if (type === 'confirm') {
                actionButtons.push({
                    name: '예',
                    color: 'primary',
                    onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose(e);
                        if (okCallback) okCallback();
                    }
                });
                actionButtons.push({
                    name: '아니오',
                    color: 'default',
                    onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose(e);
                    }
                });
            } else if (type === 'delete') {
                actionButtons.push({
                    name: '삭제',
                    color: 'del',
                    onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose(e);
                        if (okCallback) okCallback();
                    }
                });
                actionButtons.push({
                    name: '취소',
                    color: 'default',
                    onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose(e);
                    }
                });
            } else if (type === 'show') {
                actionButtons.push({
                    name: '확인',
                    color: 'primary',
                    onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose(e);
                        if (okCallback) okCallback();
                    }
                });
            }
        } else {
            actionButtons = buttons;
        }

        if (actionButtons) {
            return (
                <DialogActions className={classes.actions} disableSpacing>
                    {actionButtons.map((button) => (
                        <WmsButton
                            key={button.name}
                            color={button.color || 'default'}
                            onClick={button.onClick}
                        >
                            {button.name}
                        </WmsButton>
                    ))}
                </DialogActions>
            );
        }
        return null;
    };

    useEffect(() => {
        if (delay) {
            setTimeout(() => {
                onClose();
            }, delay);
        }
    }, [delay, onClose]);

    return (
        <Dialog
            {...dialogProps}
            classes={{ paper: overrideClassName, paperWidthXs: classes.paperWidthXs }}
            open={open}
            maxWidth="xs"
            onClose={onClose}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            disableBackdropClick
        >
            {title && (
                <DialogTitle disableTypography className={classes.title}>
                    <Typography component="div" variant="h4">
                        {title}
                    </Typography>
                    {titleCloseButton && <WmsIconButton icon="close" onClick={onClose} />}
                </DialogTitle>
            )}
            <DialogContent className={classes.content}>{children}</DialogContent>
            {renderActions()}
        </Dialog>
    );
};

WmsDialogAlert.propTypes = {
    /**
     * 경고 타입(alert, confirm, show, delete)
     */
    type: PropTypes.oneOf(['alert', 'confirm', 'show', 'delete']),
    /**
     * dialog 타이틀
     */
    title: PropTypes.string,
    /**
     * dialog 타이틀의 클로즈버튼 show/hide
     */
    titleCloseButton: PropTypes.bool,
    /**
     * auto close까지 시간
     */
    delay: PropTypes.number,
    /**
     * dialog close시 실행하며 필수 함수
     */
    onClose: PropTypes.func.isRequired,
    /**
     * 자동생성 버튼의 callback
     */
    okCallback: PropTypes.func,
    /**
     * material의 dialog에 전달할 dialog props
     */
    dialogProps: PropTypes.objectOf(PropTypes.any),
    /**
     * dialog actions에 들어갈 버튼정의 object
     */
    buttons: PropTypes.arrayOf(PropTypes.object)
};

WmsDialogAlert.defaultProps = {
    type: 'show',
    title: undefined,
    titleCloseButton: false,
    delay: undefined,
    okCallback: undefined,
    dialogProps: undefined,
    buttons: undefined
};

export default WmsDialogAlert;
