import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import { WmsDraggableDialog, WmsTable } from '~/components';
import { registerColumns } from './dialogColumns';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';
import { agGrids } from '~/utils/agGridUtil';
import { dragStopGrid } from '~/stores/desking/gridStore';

const useStyle = makeStyles(style);

const RegisterDialog = (props) => {
    const { component, moveRows, agGridIndex, open, onClose } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { list, error, loading } = useSelector(({ deskingStore, loadingStore }) => ({
        list: deskingStore.list,
        error: deskingStore.error,
        loading: loadingStore['deskingStore/GET_COMPONENT_WORK_LIST']
    }));
    const [listRows, setListRows] = useState([]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            const filterList = list.filter((t) => t.seq !== component.seq); // 본인의 컴포넌트는 제외
            setListRows(
                filterList.map((t, index) => ({
                    id: String(t.seq),
                    gridIndex: index,
                    seq: t.seq,
                    name: `${t.componentSeq}_${t.componentName}`,
                    componentSeq: t.componentSeq,
                    componentName: t.componentName
                }))
            );
        }
    }, [component.seq, list]);

    const handleRowClick = useCallback(
        (e, row) => {
            let tgtIndex = null;
            let tgtComponent = null;
            list.forEach((c, index) => {
                if (c.seq === row.seq) {
                    tgtIndex = index;
                    tgtComponent = produce(c, (draft) => draft);
                }
            });
            if (tgtIndex !== null && tgtComponent !== null) {
                const option = {
                    srcGrid: agGrids.prototype.grids[agGridIndex],
                    tgtGrid: agGrids.prototype.grids[tgtIndex],
                    srcComponent: component,
                    tgtComponent,
                    nodes: moveRows
                };
                dispatch(dragStopGrid(option));
            }
        },
        [agGridIndex, component, dispatch, list, moveRows]
    );

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            width={280}
            height={281}
            title="기사 이동"
            content={
                <div className={clsx(classes.popupBody, classes.h100, classes.pb15)}>
                    <WmsTable
                        columns={registerColumns}
                        rows={listRows}
                        onRowClick={handleRowClick}
                        // currentId={currentSeq}
                        loading={loading}
                        error={error}
                        paging={false}
                        header={false}
                    />
                </div>
            }
        />
    );
};

export default RegisterDialog;
