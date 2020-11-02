import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaPagination } from '@components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import Tooltip from './MokaTableTooltip';

const propTypes = {
    /**
     * 목록 컬럼정의
     */
    columnDefs: PropTypes.arrayOf(PropTypes.object),
    /**
     * 목록 데이타
     */
    rowDatapageSizes: PropTypes.arrayOf(PropTypes.object),
    /**
     * agGrid getRowNodeId()
     */
    onRowNodeId: PropTypes.func,
    /**
     * agGrid 높이
     */
    agGridHeight: PropTypes.number,
    /**
     * 테이블 헤더 여부
     */
    header: PropTypes.bool,
    /**
     * 로딩 텍스트
     */
    localeText: PropTypes.object,
    /**
     * row clicked
     */
    onRowClicked: PropTypes.func,
    /**
     * 페이징여부
     */
    paging: PropTypes.bool,
    /**
     * 총갯수
     */
    total: PropTypes.number,
    /**
     * 페이지번호( zero base )
     */
    page: PropTypes.number,
    /**
     * 페이지당 데이타 건수
     */
    size: PropTypes.number,
    /**
     * 데이타 건수 옵션 목록
     */
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    /**
     * 그룹당 페이지 개수
     */
    displayPageNum: PropTypes.number,
    /**
     * 검색조건 변경 ( 페이지, 데이타건수 변경 )
     */
    onChangeSearchOption: PropTypes.func,
    /**
     * row click 이벤트 막는 cell의 필드 리스트
     */
    preventRowClickCell: PropTypes.arrayOf(PropTypes.string),
    /**
     * selected row 갯수
     */
    rowSelection: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 선택된 아이디
     */
    selected: PropTypes.any,
    /**
     * 드래그여부
     */
    dragging: PropTypes.bool,
    /**
     * 드래그 함수
     */
    onRowDragMove: PropTypes.func,
};
const defaultProps = {
    localeText: { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' },
    loading: false,
    paging: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    preventRowClickCell: [],
    rowSelection: 'single',
    dragging: false,
    header: true,
};

const MokaTable = (props) => {
    // table props
    const { columnDefs, rowData, onRowNodeId, agGridHeight, localeText, onRowClicked, loading, preventRowClickCell, rowSelection, selected, header } = props;
    const { dragging, onRowDragMove } = props;

    // button props
    const { onAppendClick, onDeleteClick } = props;

    // paging props
    const { paging, total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    const [gridApi, setGridApi] = useState(null);

    /**
     * 로딩중 메세지
     */
    useEffect(() => {
        if (gridApi) {
            if (loading) {
                gridApi.showLoadingOverlay();
            } else {
                gridApi.hideOverlay();
            }
        }
    }, [loading, gridApi]);

    /**
     * agGrid 로딩전 인스턴스설정
     * @param {object} params grid object
     */
    const onGridReady = (params) => {
        setGridApi(params.api);
        params.api.hideOverlay(); // 조회결과 없음(No Rows..)메세지 표시 안함.
    };

    /**
     * RowClick
     * RowClick을 CellClick으로 받아서, cell별 설정에 따라서 RowClick를 호출한다.
     * @param {object} params grid object
     */
    const handleCellClicked = useCallback(
        (params) => {
            if (!preventRowClickCell.includes(params.colDef.field)) {
                onRowClicked(params.node.data);
            }
            if (params.colDef.field === 'append') {
                if (onAppendClick) onAppendClick(params.node.data);
            }

            if (params.colDef.field === 'delete') {
                if (onDeleteClick) onDeleteClick(params.node.data);
            }
        },
        [onAppendClick, onDeleteClick, onRowClicked, preventRowClickCell],
    );

    const handleRowDragMove = (event) => {
        var movingNode = event.node;
        var overNode = event.overNode;
        var rowNeedsToMove = movingNode !== overNode;
        if (rowNeedsToMove) {
            var movingData = movingNode.data;
            var overData = overNode.data;
            var fromIndex = rowData.indexOf(movingData);
            var toIndex = rowData.indexOf(overData);
            var newStore = rowData.slice();
            moveInArray(newStore, fromIndex, toIndex);
            // rowData = newStore;
            gridApi.setRowData(newStore);
            gridApi.clearFocusedCell();
            onRowDragMove(event, newStore);
        }
        function moveInArray(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }
    };

    /**
     * usedYn에 따른 row 색상 처리
     * @param {object} instance 인스턴스
     */
    const getRowClass = (instance) => {
        if (instance.node.data.usedYn === 'N') {
            return 'usedyn-n';
        }
        return undefined;
    };

    /**
     * ag-grid가 화면에 그릴 row data가 변경되었을 때 실행된다.
     * (selected 값이 있을 때 select함)
     */
    const handleSelected = useCallback(() => {
        if (gridApi) {
            gridApi.deselectAll();
        }
        if (selected && gridApi) {
            const selectedNode = gridApi.getRowNode(selected);
            if (selectedNode) {
                selectedNode.selectThisNode(true);
            }
        }
    }, [selected, gridApi]);

    const handleRowDataUpdated = useCallback(() => {
        setTimeout(function () {
            handleSelected();
        });
    }, [handleSelected]);

    useEffect(() => {
        handleSelected();
    }, [handleSelected]);

    return (
        <>
            {/* 목록 */}
            <div className={clsx('ag-theme-moka-grid', { 'ag-header-no': !header })} style={{ height: `${agGridHeight}px` }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    getRowNodeId={onRowNodeId}
                    immutableData
                    animateRows
                    localeText={localeText}
                    onCellClicked={handleCellClicked}
                    onGridReady={onGridReady}
                    rowSelection={rowSelection}
                    rowDragManaged={dragging}
                    suppressMoveWhenRowDragging={dragging}
                    onRowDragMove={handleRowDragMove}
                    onRowDataUpdated={handleRowDataUpdated}
                    tooltipShowDelay={0}
                    defaultColDef={
                        {
                            // tooltipComponent: 'mokaTooltip',
                        }
                    }
                    frameworkComponents={{ mokaTooltip: Tooltip }}
                    suppressRowClickSelection
                    getRowClass={getRowClass}
                />
            </div>
            {/* 페이징 */}
            {paging ? (
                <div className="mt-3">
                    <MokaPagination total={total} page={page} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={pageSizes} displayPageNum={displayPageNum} />
                </div>
            ) : null}
        </>
    );
};

MokaTable.propTypes = propTypes;
MokaTable.defaultProps = defaultProps;

export default MokaTable;
