import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsDraggableDialog, WmsTable, WmsIconButton, WmsButton } from '~/components';
import { myComponentLeftTableColumns, myComponentRightTableColumns } from './dialogColumns';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

const useStyle = makeStyles(style);

const ComponentEditDialog = (props) => {
    const { open, onClose } = props;
    const classes = useStyle();

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="사용컴포넌트 설정"
            width={553}
            height={503}
            content={
                <div className={clsx(classes.popupBody, classes.spaceBetween, classes.h100)}>
                    <div className={clsx(classes.componentEditTable, classes.h100)}>
                        <WmsTable columns={myComponentLeftTableColumns} border paging={false} />
                    </div>
                    <WmsIconButton icon="arrow_forward" overrideClassName={classes.arrowBtn} />
                    <div className={clsx(classes.componentEditTable, classes.h100)}>
                        <WmsTable columns={myComponentRightTableColumns} border paging={false} />
                    </div>
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long">
                        적용
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};

export default ComponentEditDialog;
