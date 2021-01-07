import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { columnDefs, localeText } from './BannedListGridColumns';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import { blockReason, bannedIdList } from '@pages/CommentManage/CommentConst';
import { MokaPagination, MokaLoader } from '@components';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import BanneButtonRenderer from './BanneButtonRenderer';

const BannedListGrid = () => {
    const [listRows, setListRows] = useState([]);
    const [gridReadyState, setGridReadyState] = useState(false);
    const [search, setSearch] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const loading = false;

    const { pagePathName, pageGubun } = useSelector((store) => ({
        pagePathName: store.comment.banneds.pagePathName,
        pageGubun: store.comment.banneds.pageGubun,
    }));

    const [columnDefsInfo, setColumnDefsInfo] = useState([]);

    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            // dispatch(getCommentList(changeSearchOption(temp)));
        },
        [search],
    );

    const handleCellClicked = (e) => {
        // console.log('handleCellClicked', e);
    };

    const handleRowDataUpdated = (e) => {
        // console.log('handleRowDataUpdated', e);
    };

    const tempEvent = (e) => {
        console.log(e);
    };

    const onGridReady = (params) => {
        console.log(params);
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        setGridReadyState(true);

        setTimeout(function () {
            // params.api.setRowData(createRowData());
            // setGridRowData(params);

            params.columnApi.resetColumnState();
        }, 500);
    };

    const rowClassRules = {
        // 'ag-rel-row': (params) => params.data.rel === false,
    };

    const getRowHeight = (params) => {
        // console.log('getRowHeight', params);
    };

    const onColumnResized = (params) => {
        params.api.resetRowHeights();
    };

    const onColumnVisible = (params) => {
        params.api.resetRowHeights();
        // params.columnApi.resetColumnState();
    };

    useEffect(() => {
        setListRows(bannedIdList.list);
    }, []);

    const createRowData = (element) => {
        return element.map((item, i) => {
            return {
                bannedYn: item.bannedYn,
                commentSeq: item.commentSeq,
                commentId: item.commentId,
                regIp: item.regIp,
                word: item.word,
                source: item.source,
                reason: item.reason,
                content: item.content,
                regId: item.regId,
                userName: item.userName,
                regDt: item.regDt,
            };
        });
    };

    useEffect(() => {
        if (typeof gridColumnApi === 'function') {
            gridColumnApi.resetColumnState();
        }

        if (gridApi) {
            setTimeout(function () {
                gridApi.setRowData(createRowData(bannedIdList.list));
            }, 500);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnDefsInfo, gridApi]);

    useEffect(() => {
        if (columnDefs.hasOwnProperty(pageGubun)) {
            setTimeout(function () {
                setColumnDefsInfo(columnDefs[pageGubun]);
            }, 500);
        }
    }, [gridColumnApi, pageGubun]);

    return (
        <>
            <div className={clsx('ag-theme-moka-grid position-relative', { 'ag-header-no': false })}>
                {loading && <MokaLoader />}

                <AgGridReact
                    // immutableData
                    defaultColDef={{
                        // flex: 1,
                        wrapText: true,
                        autoHeight: true,
                        // sortable: true,
                        resizable: true,
                    }}
                    onGridReady={onGridReady}
                    animateRows={false}
                    // rowData={listRows}
                    getRowNodeId={(params) => params.commentSeq}
                    columnDefs={columnDefsInfo}
                    localeText={localeText}
                    onRowSelected={tempEvent}
                    rowSelection="multiple"
                    onCellClicked={handleCellClicked}
                    onRowDataUpdated={handleRowDataUpdated}
                    rowClassRules={rowClassRules}
                    getRowHeight={getRowHeight}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    frameworkComponents={{ BanneButtonRenderer: BanneButtonRenderer }}
                />
            </div>
            <div className="mt-3">
                <MokaPagination total={10} page={0} size={20} displayPageNum={DISPLAY_PAGE_NUM} onChangeSearchOption={handleChangeSearchOption} pageSizes={PAGESIZE_OPTIONS} />
            </div>
        </>
    );
};

export default BannedListGrid;
