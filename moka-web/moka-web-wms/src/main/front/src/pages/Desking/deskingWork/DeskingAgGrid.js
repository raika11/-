import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import style from '~/assets/jss/pages/Desking/DeskingListStyle';
import { agGrids, makeTitleEx } from '~/utils/agGridUtil';
import { deskingColumns, localeText, ReadyGrid } from '../components';
import { sortGrid, changeGrid } from '~/stores/desking/gridStore';
import { openDummyForm } from '~/stores/desking/deskingStore';

const useStyles = makeStyles(style);

/**
 * 데스킹 AgGrid (1개)
 * @param {object} props.component 편집컴포넌트
 * @param {number} props.agGridIndex 해당 컴포넌트가 데스킹 AgGrid 중에서 몇번째인지 알려주는 인덱스
 * @param {function} props.onRowClicked 편집기사선택
 */
const DeskingAgGrid = (props) => {
    const { component, agGridIndex, onRowClicked } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { latestContentsId } = useSelector((store) => ({
        latestContentsId: store.deskingStore.latestContentsId
    }));

    const [listRows, setListRows] = useState([]);
    const [grid, setGrid] = useState(null);

    // 목록정보 로컬화
    useEffect(() => {
        if (component && component.deskingWorks) {
            setListRows(
                component.deskingWorks.map((d) => {
                    return {
                        ...d,
                        gridType: 'DESKING',
                        componentWorkSeq: component.seq,
                        contentsOrderEx: `00${d.contentsOrder}`.substr(-2),
                        titleEx: makeTitleEx(d.title, d.distYmdt, d.relCount, d.pvCount, d.uvCount)
                    };
                })
            );
        }
    }, [agGridIndex, component]);

    const onGridReady = (params) => {
        // 조회결과 없음(No Rows..)메세지 표시 안함.
        params.api.hideOverlay();

        if (agGrids.prototype.grids[agGridIndex]) {
            if (agGrids.prototype.grids[agGridIndex].api) {
                agGrids.prototype.grids[agGridIndex].api.destroy();
            }
            if (agGrids.prototype.grids[agGridIndex].columnApi) {
                if (typeof agGrids.prototype.grids[agGridIndex].columnApi.destroy === 'function') {
                    agGrids.prototype.grids[agGridIndex].columnApi.destroy();
                }
            }
        }
        agGrids.prototype.change(agGridIndex, params);
        dispatch(changeGrid());

        setGrid(params);
    };

    const handleRowDragEnd = useCallback(
        (params) => {
            dispatch(sortGrid({ grid: params, component }));
        },
        [component, dispatch]
    );

    // latestContentsId 와 동일한 row selected 효과
    useEffect(() => {
        if (latestContentsId !== null) {
            document.querySelectorAll(`.${classes.agSelected}`).forEach((dom) => {
                dom.classList.remove(classes.agSelected);
            });

            const dom = document.querySelectorAll(
                `.ag-center-cols-container [row-id="${latestContentsId}"]`
            );
            if (dom.length > 0) {
                dom[0].classList.add(classes.agSelected);
            }
        }
    }, [latestContentsId, classes]);

    const handleCellClicked = useCallback(
        (params) => {
            function* je() {
                if (params.data.contentsAttr !== 'D') {
                    yield dispatch(openDummyForm(false));
                } else {
                    yield dispatch(openDummyForm(true));
                }
                yield onRowClicked(params, agGridIndex);
            }

            // 삭제 버튼 제외
            if (params.colDef.field !== 'deskingDelete') {
                const iterator = je();
                iterator.next();
                iterator.next();
            }
        },
        [dispatch, agGridIndex, onRowClicked]
    );

    // <div rule="menu" className={clsx('ag-theme-balham', classes.ag)}>
    return (
        <div rule="menu" className={clsx('ag-theme-wms-grid', classes.ag)}>
            <AgGridReact
                rowData={listRows}
                onGridReady={onGridReady}
                onRowDragEnd={handleRowDragEnd}
                onCellClicked={handleCellClicked}
                getRowNodeId={(params) => params.contentsId}
                columnDefs={deskingColumns}
                rowSelection="multiple"
                rowDragManaged
                animateRows
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                immutableData
                headerHeight={0}
                rowHeight={53}
                groupHeaderHeight={0}
                localeText={localeText}
            />
            {grid && <ReadyGrid grid={grid} component={component} />}
        </div>
    );
};

export default DeskingAgGrid;
