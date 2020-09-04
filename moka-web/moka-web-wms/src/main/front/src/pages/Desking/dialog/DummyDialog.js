import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsButton, WmsDraggableDialog, WmsSelect } from '~/components';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

const DummyDialog = (props) => {
    const { open, onClose } = props;
    const classes = useStyle();

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="더미기사"
            maxWidth="lg"
            overrideClassName={classes.dialogWidth}
            content={
                <div className={classes.popupBody}>
                    <div className={classes.flex}>
                        <div className={classes.dummyLeft}>
                            <div className={classes.mb8}>
                                <WmsTextField
                                    label="제목"
                                    labelWidth="50"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </div>
                            <div>
                                <WmsTextField
                                    overrideClassName={classes.mr8}
                                    label="링크"
                                    labelWidth="50"
                                    width="316"
                                />
                                <WmsSelect
                                    // rows={}
                                    width="176"
                                    name="searchType"
                                    // currentId={}
                                    // onChange={}
                                />
                            </div>
                        </div>
                        <div className={classes.dummyRight}>
                            <div className={clsx(classes.mb8, classes.imageInsert)}></div>
                            <div className={classes.imageButton}>
                                <WmsButton
                                    color="wolf"
                                    size="lg"
                                    overrideClassName={clsx(classes.mr8, classes.ml8)}
                                >
                                    편집
                                </WmsButton>
                            </div>
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long">
                        저장
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};
export default DummyDialog;
