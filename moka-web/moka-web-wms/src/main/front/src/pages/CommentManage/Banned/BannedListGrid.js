import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { bannedIdList } from '@pages/CommentManage/CommentConst';
import CommentAgGrid from '@pages/CommentManage/CommentAgGrid';
import BanneButtonRenderer from './BanneButtonRenderer';
import { columnDefs, localeText } from './BannedListGridColumns';

const BannedListGrid = () => {
    const [listRows, setListRows] = useState([]);
    const [gridReadyState, setGridReadyState] = useState(false);
    const [search, setSearch] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [columnDefsInfo, setColumnDefsInfo] = useState([]);
    const loading = false;

    const { pageGubun } = useSelector((store) => ({
        pageGubun: store.comment.banneds.pageGubun,
    }));

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
        // params.columnApi.resetColumnState();
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        setTimeout(function () {
            // params.columnApi.resetColumnState();
            // setGridReadyState(false);
            // params.api.setRowData(createRowData());
            // setGridRowData(params);
            // params.api.refreshCells();
            // params.api.refreshView();
            // params.columnApi.resetColumnState();
            // setGridReadyState(true);
        }, 500);
        // setGridReadyState(true);
        // console.log(1);
        // setGridReadyState(true);
        // setTimeout(function () {
        //     setGridReadyState(true);
        // }, 500);
    };
    const onColumnResized = (params) => {
        params.api.resetRowHeights();
        // if (typeof gridColumnApi === 'function') {
        //     gridColumnApi.resetColumnState();
        // }
        gridColumnApi.resetColumnState();
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
                commentSeq: item.commentSeq,
                regIp: item.regIp,
                bannedYn: item.bannedYn,
                commentId: item.commentId,
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
        if (gridApi) {
            setTimeout(function () {
                gridApi.setRowData(createRowData(bannedIdList.list));
            }, 500);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnDefsInfo, gridApi]);

    useEffect(() => {
        if (columnDefs.hasOwnProperty(pageGubun)) {
            // setColumnDefsInfo([]);
            // setGridReadyState(false);
            setTimeout(function () {
                setColumnDefsInfo(columnDefs[pageGubun]);
            }, 500);
        }
    }, [gridColumnApi, pageGubun]);

    useEffect(() => {
        // console.log(gridReadyState);
    }, [gridReadyState]);

    useEffect(() => {
        // setGridReadyState(true);
    }, []);

    return (
        <>
            {(function () {
                if (pageGubun === 'id') {
                    return (
                        <>
                            <CommentAgGrid
                                loading={loading}
                                columnDefs={columnDefs.id}
                                localeText={localeText}
                                onColumnResized={(e) => onColumnResized(e)}
                                onColumnVisible={(e) => onColumnVisible(e)}
                                onGridReady={(e) => onGridReady(e)}
                                changeSearchOption={(e) => handleChangeSearchOption(e)}
                                frameworkComponents={{ BanneButtonRenderer: BanneButtonRenderer }}
                            />
                        </>
                    );
                } else if (pageGubun === 'ip') {
                    return (
                        <>
                            <CommentAgGrid
                                loading={loading}
                                columnDefs={columnDefs.ip}
                                localeText={localeText}
                                onColumnResized={(e) => onColumnResized(e)}
                                onColumnVisible={(e) => onColumnVisible(e)}
                                onGridReady={(e) => onGridReady(e)}
                                changeSearchOption={(e) => handleChangeSearchOption(e)}
                                frameworkComponents={{ BanneButtonRenderer: BanneButtonRenderer }}
                            />
                        </>
                    );
                } else if (pageGubun === 'word') {
                    return (
                        <>
                            <CommentAgGrid
                                loading={loading}
                                columnDefs={columnDefs.word}
                                localeText={localeText}
                                onColumnResized={(e) => onColumnResized(e)}
                                onColumnVisible={(e) => onColumnVisible(e)}
                                onGridReady={(e) => onGridReady(e)}
                                changeSearchOption={(e) => handleChangeSearchOption(e)}
                                frameworkComponents={{ BanneButtonRenderer: BanneButtonRenderer }}
                            />
                        </>
                    );
                }
                // if (gridReadyState) {
                // return (
                //     <>
                //         <CommentAgGrid
                //             loading={loading}
                //             columnDefs={columnDefsInfo}
                //             localeText={localeText}
                //             onColumnResized={(e) => onColumnResized(e)}
                //             onColumnVisible={(e) => onColumnVisible(e)}
                //             onGridReady={(e) => onGridReady(e)}
                //             changeSearchOption={(e) => handleChangeSearchOption(e)}
                //         />
                //     </>
                // );
                // }
            })()}
        </>
    );
};

export default BannedListGrid;
