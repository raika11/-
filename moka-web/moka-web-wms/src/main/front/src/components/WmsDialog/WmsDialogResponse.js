import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import style from '~/assets/jss/components/WmsDialog/WmsDialogResponseStyle';

const useStyles = makeStyles(style);

// const styles = (theme) => ({
//     root: {
//         margin: 0,
//         padding: theme.spacing(2)
//     },
//     closeButton: {
//         position: 'absolute',
//         right: theme.spacing(1),
//         top: theme.spacing(1),
//         color: theme.palette.grey[500]
//     }
// });

// const DialogTitle = withStyles(styles)((props) => {
//     const { children, classes, onClose, ...other } = props;
//     return (
//         <MuiDialogTitle disableTypography className={classes.root} {...other}>
//             <Typography variant="h6">{children}</Typography>
//         </MuiDialogTitle>
//     );
// });
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const WmsDialogResponse = (props) => {
    const {
        open,
        onClose,
        title,
        content,
        scroll,
        actions,
        maxWidth,
        overrideClassName,
        ...rest
    } = props;

    const classes = useStyles();

    return (
        <div>
            <Dialog
                aria-labelledby="customized-dialog-title"
                disableBackdropClick
                disableEscapeKeyDown
                classes={{
                    root: clsx(classes.root, overrideClassName),
                    paperWidthSm: classes.paperWidthSm,
                    paperWidthMd: classes.paperWidthMd,
                    paperWidthLg: classes.paperWidthLg
                }}
                open={open}
                onClose={onClose}
                maxWidth={maxWidth || 'sm'}
                {...rest}
            >
                <MuiDialogTitle className={classes.title} disableTypography>
                    <Typography variant="h6">{title}</Typography>
                </MuiDialogTitle>

                {/* 콘텐츠 */}
                {content && (
                    <DialogContent className={classes.content} dividers={scroll === 'paper'}>
                        {content}
                    </DialogContent>
                )}

                {/* 액션(버튼) */}
                <MuiDialogActions classes={{ root: classes.actions }}>
                    {actions || (
                        <Button onClick={onClose} color="primary">
                            닫기
                        </Button>
                    )}
                </MuiDialogActions>
            </Dialog>
        </div>
    );
};

// WmsDialogResponse.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     title: PropTypes.string,
//     scroll: PropTypes.string,
//     content: PropTypes.element,
//     actions: PropTypes.element
// };

// WmsDialogResponse.defaultProps = {
//     open: false,
//     onClose: undefined,
//     title: '',
//     scroll: 'paper',
//     content: undefined,
//     actions: undefined
// };

export default WmsDialogResponse;
