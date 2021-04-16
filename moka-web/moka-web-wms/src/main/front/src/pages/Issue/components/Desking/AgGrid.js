import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';
import IssueContentsModal from './IssueContentsModal';

/**
 * 홈 섹션편집 > 패키지 목록 > AgGrid
 */
const AgGrid = forwardRef(({ search, list, total, loading, onDragStop, dropTargetAgGrid, onChangeSearchOption, addColumnDefs }, ref) => {
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * row 클릭
     * @param {object} data data
     * @param {object} params 클릭시 aggrid에서 넘겨주는 데이터
     */
    const handleRowClicked = (data, params) => {
        if (params.column.colId === 'regDt') {
            setSelected(data);
            setModalShow(true);
        }
    };

    /**
     * 컬럼 명세
     * @returns {array} columnDefs
     */
    const makeDefs = useCallback(() => {
        let newDefs = [...columnDefs];
        if (!dropTargetAgGrid) newDefs.splice(0, 2);
        if (addColumnDefs) {
            addColumnDefs.forEach((nd) => {
                var copy = Object.assign({}, nd);
                delete copy.index;
                newDefs.splice(nd.index, 0, copy);
            });
        }
        return newDefs;
    }, [addColumnDefs, dropTargetAgGrid]);

    useEffect(() => {
        // 드롭 타겟 ag-grid에 drop-zone 설정
        if (gridInstance && dropTargetAgGrid) {
            if (Array.isArray(dropTargetAgGrid)) {
                // 타겟이 리스트인 경우
                dropTargetAgGrid.forEach((targetGrid, agGridIndex) => {
                    addDeskingWorkDropzone(onDragStop, gridInstance, targetGrid, agGridIndex);
                });
            } else {
                // 타겟이 1개인 경우
                addDeskingWorkDropzone(onDragStop, gridInstance, dropTargetAgGrid);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropTargetAgGrid, gridInstance, onDragStop]);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                pkgTitle: unescapeHtmlArticle(data.pkgTitle || ''),
            })),
        );
    }, [list]);

    useEffect(() => {
        return () => {
            setSelected({});
            setModalShow(false);
        };
    }, []);

    return (
        <React.Fragment>
            <MokaTable
                ref={ref}
                className="overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                columnDefs={makeDefs()}
                rowData={rowData}
                rowHeight={GRID_ROW_HEIGHT.C[0]}
                onRowNodeId={(pkg) => pkg.pkgSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                selected={selected.pkgSeq}
                onChangeSearchOption={onChangeSearchOption}
                preventRowClickCell={['info']}
                applyColumnDefOrder
            />

            <IssueContentsModal
                show={modalShow}
                pkg={selected}
                onHide={() => {
                    setModalShow(false);
                    setSelected({});
                }}
            />
        </React.Fragment>
    );
});

export default AgGrid;
