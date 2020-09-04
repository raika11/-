import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { DB_DATE_FORMAT } from '~/constants';
import { articleColumns, localeText, ReadyGrid } from '../components';
import ArticleListView from './ArticleListView';

/**
 * 기사 AgGrid
 * TODO 서비스노출 중인 row를 어떻게 찾을건지 => 기사 조회 시 데스킹 테이블과 조인하여 데스킹 중인 데이터만 표시(워크 테이블 동기화 X)
 */
const ArticleListAgGrid = (props) => {
    const { classes, loading, data, updateGridCount, deskingList = [] } = props;
    const agGridRef = useRef(null);
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({});
    const [grid, setGrid] = useState(null);

    // onCellClicked (agGrid)
    const onCellClicked = (instance) => {
        if (instance.colDef.field === 'cellTitle') {
            // 팝업 띄우기
            setOpen(true);
            setCurrentArticle(instance.data);
        }
    };

    const rowClassRules = {
        [classes.isDeskedBackground]: (params) => params.data.isDesked
    };

    // getRowStyle (agGrid)
    const getRowStyle = (params) => {
        let existArticle = false;
        // 데스킹에 있는 데이터인지 확인하여 배경색 변경
        deskingList.forEach((work) => {
            const ids = work.deskingWorks.map((l) => l.contentsId);
            if (ids.indexOf(params.node.data.contentsId) > -1) {
                existArticle = true;
            }
        });
        return existArticle ? { background: '#EBF8FF' } : null;
    };

    useEffect(() => {
        setRowData(
            data.map((d) => {
                // 데스킹에 있는 데이터인지 확인하여 배경색 변경
                let isDesked = false;
                deskingList.forEach((work) => {
                    const ids = work.deskingWorks.map((l) => l.contentsId);
                    if (ids.indexOf(d.contentsId) > -1) {
                        isDesked = true;
                    }
                });
                return {
                    ...d,
                    cellDate: (() => {
                        const crt = moment(d.createYmdt, DB_DATE_FORMAT).format('MM/DD hh:mm');
                        let mdt = '';
                        if (d.modifiedYmdt) {
                            mdt = moment(d.modifiedYmdt, DB_DATE_FORMAT).format('MM/DD hh:mm');
                        }
                        return `${crt}\n${mdt}`;
                    })(),
                    cellTitle: d.title,
                    cellGijaName: d.bylineName,
                    gridType: 'ARTICLE',
                    isDesked
                };
            })
        );
    }, [data, deskingList]);

    useEffect(() => {
        if (agGridRef.current) {
            if (loading) {
                agGridRef.current.api.showLoadingOverlay();
            } else {
                agGridRef.current.api.hideOverlay();
                if (agGridRef.current.gridOptions.rowData.length > 0) {
                    setGrid(agGridRef.current);
                } else {
                    agGridRef.current.api.showNoRowsOverlay();
                }
            }
        }
    }, [loading, updateGridCount, dispatch]);

    return (
        <>
            <AgGridReact
                ref={agGridRef}
                columnDefs={articleColumns}
                rowData={rowData}
                rowSelection="multiple"
                headerHeight={50}
                rowHeight={50}
                localeText={localeText}
                suppressMoveWhenRowDragging
                enableMultiRowDragging
                suppressRowClickSelection
                rowDragManaged
                getRowNodeId={(node) => node.seq}
                onCellClicked={onCellClicked}
                rowClassRules={rowClassRules}
            />
            {grid && (
                <ReadyGrid grid={grid} isComponent={false} updateGridCount={updateGridCount} />
            )}
            <ArticleListView
                open={open}
                setOpen={setOpen}
                classes={classes}
                article={currentArticle}
            />
        </>
    );
};

export default ArticleListAgGrid;
