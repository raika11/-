import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaPagination, MokaLoader } from '@components';
import { propTypes as paginationPropTypes } from '@components/MokaPagination';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

// cell renderer
import LongTextRenderer from './MokaTableLongTextRenderer';
import ImageRenderer from './MokaTableImageRenderer';
import UsedYnRenderer from './MokaTableUsedYnRenderer';
import UsedYnSecondRenderer from './MokaTableUsedYnSecondRenderer';
import UsedYnThirdRenderer from './MokaTableUsedYnThirdRenderer';
import SwitchRenderer from './MokaTableSwitchRenderer';
import ButtonRenderer from './MokaTableButtonRenderer';

const propTypes = {
    ...paginationPropTypes,
    /**
     * ag-grid의 className
     */
    className: PropTypes.string,
    /**
     * pagination의 className
     */
    paginationClassName: PropTypes.string,
    /**
     * pagination 아이템의 size(sm이면 작게 정의하지 않으면 기본 size)
     */
    paginationSize: PropTypes.string,
    /**
     * 목록 컬럼정의
     */
    columnDefs: PropTypes.arrayOf(PropTypes.object),
    /**
     * 목록 데이터
     */
    rowDatapageSizes: PropTypes.arrayOf(PropTypes.object),
    /**
     * agGrid getRowNodeId()
     */
    onRowNodeId: PropTypes.func,
    /**
     * ag-grid div의 heigt
     */
    agGridHeight: PropTypes.number,
    /**
     * 테이블 헤더 여부
     */
    header: PropTypes.bool,
    /**
     * 테이블 헤더의 height
     */
    headerHeight: PropTypes.number,
    /**
     * 테이블 row의 height
     */
    rowHeight: PropTypes.number,
    /**
     * 테이블 행 클릭 이벤트
     */
    onRowClicked: PropTypes.func,
    /**
     * 테이블 행 클릭 이벤트를 타지 않는 field(cell) 리스트
     */
    preventRowClickCell: PropTypes.arrayOf(PropTypes.string),
    /**
     * selection이 변경되었을 때(ex, selected 변경, 혹은 체크박스 클릭) 바인드 함수
     */
    onSelectionChanged: PropTypes.func,
    /**
     * selected row 타입
     * @default
     */
    rowSelection: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 선택된 아이디
     */
    selected: PropTypes.any,
    /**
     * 드래그 테이블 스타일 적용
     * @default
     */
    dragStyle: PropTypes.bool,
    /**
     * 추가적인 frameworkComponents
     */
    frameworkComponents: PropTypes.object,
    /**
     * 쓰는 곳에서 grid Instance를 state로 관리할 때, gridReady시 state 변경
     */
    setGridInstance: PropTypes.func,
    /**
     * row data update 후 api.refreshCells 호출을 막음
     * @default
     */
    suppressRefreshCellAfterUpdate: PropTypes.bool,
    /**
     * ag-grid onRowDataUpdated
     */
    onRowDataUpdated: PropTypes.func,
    /**
     * onRowDataUpdated 후 refreshCells 호출 시 전달하는 params
     */
    refreshCellsParams: PropTypes.shape({
        rowNodes: PropTypes.array,
        columns: PropTypes.array,
        force: PropTypes.bool,
        suppressFlash: PropTypes.bool,
    }),
};

export const defaultProps = {
    // paging default
    paging: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    sizeType: '',
    // ag-grid default
    rowData: [],
    localeText: { noRowsToShow: '조회 결과가 없습니다', loadingOoo: '조회 중입니다' },
    preventRowClickCell: [],
    loading: false,
    dragStyle: false,
    header: true,
    rowSelection: 'single',
    rowDragManaged: false,
    animateRows: false,
    suppressRefreshCellAfterUpdate: false,
    rowBuffer: 100,
};

/**
 * ag-grid의 rowClassRules
 */
const rowClassRules = {
    'deskingyn-y': (params) => params.data.deskingYn === 'Y',
};

/**
 * 공통 테이블 (ag-grid 사용)
 */
const MokaTable = forwardRef((props, ref) => {
    const {
        className,
        columnDefs,
        rowData,
        onRowNodeId,
        agGridHeight,
        onRowClicked,
        onSelectionChanged,
        loading,
        preventRowClickCell,
        rowSelection,
        selected,
        header,
        frameworkComponents,
        setGridInstance: setParentGridInstance,
        suppressRefreshCellAfterUpdate,
        onRowDataUpdated,
        refreshCellsParams,
        dragStyle,
        // 페이지네이션 props
        paginationClassName,
        paging,
        total,
        page,
        size,
        pageSizes,
        paginationSize,
        displayPageNum,
        onChangeSearchOption,
        showTotalString,
        // 그 외 ag-grid의 props
        ...rest
    } = props;

    const [instance, setInstance] = useState(null);
    const divRef = useRef(null);

    /**
     * 2020-11-27 09:35 MokaTable 외부에서 selected 값이 바껴도 unseleced가 동작 되지 않아서
     * 아래 처럼 변수에 담아놓고 값이 현재 값과 비교해서 다르면 un seleced 가 되도록 값을 담아 놓음.
     */
    const initSelected = useRef(selected);

    // return ref 설정
    useImperativeHandle(
        ref,
        () => ({
            gridApi: instance?.api,
            grid: instance,
        }),
        [instance],
    );

    /**
     * ag-grid가 화면에 그릴 row data가 변경되었을 때 실행
     * (selected 값이 있을 때 select함)
     */
    const handleSelected = useCallback(
        (params) => {
            if (!params) return;
            if (selected || initSelected.current !== selected) {
                params.api.deselectAll();
                const selectedNode = params.api.getRowNode(selected);
                if (selectedNode) {
                    selectedNode.selectThisNode(true);
                    initSelected.current = selected;
                }
            }
        },
        [selected],
    );

    /**
     * cell별 설정에 따라서 RowClick를 호출
     * @param {object} params grid object
     */
    const handleCellClicked = useCallback(
        (params) => {
            if (onRowClicked && !preventRowClickCell.includes(params.colDef.field)) {
                onRowClicked(params.node.data, params);
            }
        },
        [onRowClicked, preventRowClickCell],
    );

    /**
     * selection 변경 시 실행
     * @param {object} params grid
     */
    const handleSelectionChanged = useCallback(
        (params) => {
            if (onSelectionChanged) {
                const selectedNodes = params.api.getSelectedNodes();
                onSelectionChanged(selectedNodes, rowSelection);
            }
        },
        [onSelectionChanged, rowSelection],
    );

    /**
     * When a column is resized, the grid re-calculates the row heights after the resize is finished
     * @param {object} params grid
     */
    const onColumnResized = (params) => params.api.resetRowHeights();

    /**
     * When a column is shown or hidden, the grid re-calculates the row heights after the resize is finished
     * @param {object} params grid
     */
    const onColumnVisible = (params) => params.api.resetRowHeights();

    /**
     * row 데이터 업데이트 시 실행
     */
    const handleRowDataUpdated = useCallback(
        (params) => {
            setTimeout(function () {
                handleSelected(params);

                if (!suppressRefreshCellAfterUpdate) {
                    params.api.refreshCells(refreshCellsParams);
                }
            });

            if (onRowDataUpdated) {
                onRowDataUpdated(params);
            }
        },
        [handleSelected, onRowDataUpdated, refreshCellsParams, suppressRefreshCellAfterUpdate],
    );

    /**
     * agGrid 로딩 전 인스턴스 설정
     * @param {object} params grid object
     */
    const onGridReady = useCallback(
        (params) => {
            setInstance(params);
            if (setParentGridInstance) {
                setParentGridInstance(params);
            }
        },
        [setParentGridInstance],
    );

    useEffect(() => {
        handleSelected(instance);
    }, [instance, handleSelected]);

    return (
        <React.Fragment>
            {/* ag-grid */}
            <div
                className={clsx('position-relative', className, { 'ag-header-no': !header, 'ag-theme-moka-grid': !dragStyle, 'ag-theme-moka-dnd-grid': dragStyle })}
                style={{ height: `${agGridHeight}px` }}
                ref={divRef}
            >
                {loading && <MokaLoader />}
                <AgGridReact
                    suppressMovableColumns
                    suppressRowClickSelection
                    {...rest}
                    immutableData
                    columnDefs={columnDefs}
                    rowData={rowData}
                    getRowNodeId={onRowNodeId}
                    rowClassRules={rowClassRules}
                    onCellClicked={handleCellClicked}
                    onSelectionChanged={handleSelectionChanged}
                    onGridReady={onGridReady}
                    rowSelection={rowSelection}
                    onRowDataUpdated={handleRowDataUpdated}
                    tooltipShowDelay={0}
                    frameworkComponents={{
                        longTextRenderer: LongTextRenderer,
                        imageRenderer: ImageRenderer,
                        usedYnRenderer: UsedYnRenderer,
                        usedYnSecondRenderer: UsedYnSecondRenderer,
                        usedYnThirdRenderer: UsedYnThirdRenderer,
                        switchRenderer: SwitchRenderer,
                        buttonRenderer: ButtonRenderer,
                        ...frameworkComponents,
                    }}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    enableMultiRowDragging={rowSelection === 'multiple'}
                />
            </div>

            {/* 페이지네이션 */}
            {paging ? (
                <div className="mt-card">
                    <MokaPagination
                        total={total}
                        page={page}
                        size={size}
                        onChangeSearchOption={onChangeSearchOption}
                        pageSizes={pageSizes}
                        displayPageNum={displayPageNum}
                        showTotalString={showTotalString}
                        className={paginationClassName}
                        paginationSize={paginationSize}
                    />
                </div>
            ) : null}
        </React.Fragment>
    );
});

MokaTable.propTypes = propTypes;
MokaTable.defaultProps = defaultProps;

export default MokaTable;
