import React from 'react';
import Draggable from 'react-draggable';
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
import { ResizableBox } from 'react-resizable';
import { makeStyles } from '@material-ui/core/styles';
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
 * 리사이즈 가능한 다이얼로그
 * (react-resizable 사용함)
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈 함수
 * @param {string} props.title 다이얼로그 타이틀
 * @param {element} props.content 다이얼로그 컨텐츠(any)
 * @param {string} props.scroll 스크롤 body | paper
 * @param {element} props.actions 다이얼로그 액션에 들어갈 컨텐츠
 * @param {number|string} props.height 높이값
 * @param {string} props.overrideClassName 오버라이드스타일
 */
const WmsResizeDialog = (props) => {
    const {
        open,
        onClose,
        title,
        content,
        scroll,
        actions,
        width,
        height,
        overrideClassName,
        ...rest
    } = props;
    const classes = useStyles();

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            maxWidth={false}
            {...rest}
        >
            <ResizableBox
                height={height}
                width={width}
                className={classes.resizable}
                minConstraints={[width, height]}
                maxConstraints={[window.innerWidth - 64, window.innerHeight - 64]}
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
                    <DialogContent
                        className={classes.resizableBoxContent}
                        dividers={scroll === 'paper'}
                    >
                        {content}
                    </DialogContent>
                )}

                {/* 액션(버튼) */}
                <DialogActions classes={{ root: classes.actions }}>
                    {actions || (
                        <Button onClick={onClose} color="primary">
                            닫기
                        </Button>
                    )}
                </DialogActions>
            </ResizableBox>
        </Dialog>
    );
};

export default WmsResizeDialog;
