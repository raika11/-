import React from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import {
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { WmsLoader } from '~/components';
import style from '~/assets/jss/components/WmsDialog/WmsDraggableDialogStyle';

const useStyles = makeStyles(style);
const PaperComponent = (props) => {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
};

/**
 * 드래그 가능한 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈 함수
 * @param {string} props.title 다이얼로그 타이틀
 * @param {element} props.content 컨텐츠
 * @param {string} props.scroll 스크롤 body | paper
 * @param {element} props.actions 다이얼로그 액션에 들어갈 컨텐츠
 * @param {string} props.maxWidth sm | md | lg | xl
 * @param {number|string} props.width 넓이값
 * @param {number|string} props.height 높이값
 * @param {string} props.overrideClassName 오버라이드할 클래스명
 * @param {boolean} props.loading 본문 로딩여부
 */
const WmsDraggableDialog = (props) => {
    const {
        open,
        onClose,
        title,
        content,
        scroll,
        actions,
        maxWidth,
        width,
        height,
        overrideClassName,
        loading,
        ...rest
    } = props;
    const classes = useStyles({ width, height });

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            classes={{
                root: clsx(classes.root, overrideClassName),
                paperWidthSm: classes.paperWidthSm,
                paperWidthMd: classes.paperWidthMd,
                paperWidthLg: classes.paperWidthLg,
                paperWidthXl: classes.paperWidthXl
            }}
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            maxWidth={maxWidth}
            {...rest}
        >
            {/* 타이틀 */}
            <DialogTitle className={classes.title} id="draggable-dialog-title">
                <span>{title}</span>
            </DialogTitle>

            <IconButton
                onClick={onClose}
                className={classes.closeBtn}
                disableFocusRipple
                disableRipple
            >
                <CloseIcon />
            </IconButton>

            {/* 콘텐츠 */}
            {content && (
                <DialogContent className={classes.content} dividers={scroll === 'paper'}>
                    {loading && (
                        <div className={classes.loadingBox}>
                            <WmsLoader />
                        </div>
                    )}
                    {content}
                </DialogContent>
            )}

            {/* 액션(버튼) */}
            {actions && (
                <DialogActions classes={{ root: classes.actions }}>
                    {actions || (
                        <Button onClick={onClose} color="primary">
                            닫기
                        </Button>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
};

WmsDraggableDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    scroll: PropTypes.string,
    content: PropTypes.element,
    actions: PropTypes.element,
    maxWidth: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
};

WmsDraggableDialog.defaultProps = {
    open: false,
    onClose: undefined,
    title: '',
    scroll: 'paper',
    content: undefined,
    actions: undefined,
    maxWidth: 'sm',
    width: undefined,
    height: undefined
};

export default WmsDraggableDialog;
