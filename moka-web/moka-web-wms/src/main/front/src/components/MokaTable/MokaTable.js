import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaPagination } from '@components';
import { propTypes as paginationPropTypes } from '@components/MokaPagination';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import Tooltip from './MokaTableTooltip';

const propTypes = {
    /**
     * pagination props
     */
    ...paginationPropTypes,
    /**
     * pagination의 className
     */
    paginationClassName: PropTypes.string,
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
    dragging: false,
    header: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    preventRowClickCell: [],
    rowSelection: 'single',
};

/**
 * 공통 테이블 (ag-grid 사용)
 */
const MokaTable = (props) => {
    // table props
    const { columnDefs, rowData, onRowNodeId, agGridHeight, localeText, onRowClicked, loading, preventRowClickCell, rowSelection, selected, header } = props;
    const { dragging, onRowDragMove } = props;

    // paging props
    const { paginationClassName, paging, total, page, size, pageSizes, displayPageNum, onChangeSearchOption, showTotalString } = props;
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
        },
        [onRowClicked, preventRowClickCell],
    );

    const handleRowDragMove = (event) => {
        const movingNode = event.node;
        const overNode = event.overNode;
        const rowNeedsToMove = movingNode !== overNode;
        if (rowNeedsToMove) {
            const movingData = movingNode.data;
            const overData = overNode.data;
            const fromIndex = rowData.indexOf(movingData);
            const toIndex = rowData.indexOf(overData);
            const newStore = rowData.slice();
            moveInArray(newStore, fromIndex, toIndex);
            // rowData = newStore;
            gridApi.setRowData(newStore);
            gridApi.clearFocusedCell();
            onRowDragMove(event, newStore);
        }
        function moveInArray(arr, fromIndex, toIndex) {
            const element = arr[fromIndex];
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
        <React.Fragment>
            {/* ag-grid */}
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
                    // defaultColDef={{ tooltipComponent: 'mokaTooltip' }}
                    frameworkComponents={{ mokaTooltip: Tooltip }}
                    suppressRowClickSelection
                    getRowClass={getRowClass}
                />
            </div>

            {/* 페이지네이션 */}
            {paging ? (
                <div className="mt-3">
                    <MokaPagination
                        total={total}
                        page={page}
                        size={size}
                        onChangeSearchOption={onChangeSearchOption}
                        pageSizes={pageSizes}
                        displayPageNum={displayPageNum}
                        showTotalString={showTotalString}
                        className={paginationClassName}
                    />
                </div>
            ) : null}
        </React.Fragment>
    );
};

MokaTable.propTypes = propTypes;
MokaTable.defaultProps = defaultProps;

export default MokaTable;
