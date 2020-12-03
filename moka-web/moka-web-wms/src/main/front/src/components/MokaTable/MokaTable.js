import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaPagination, MokaLoader } from '@components';
import { propTypes as paginationPropTypes } from '@components/MokaPagination';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

// cell renderer
import ImageRenderer from './MokaTableImageRenderer';

const propTypes = {
    /**
     * pagination props
     */
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
     * 테이블 헤더의 height
     */
    headerHeight: PropTypes.number,
    /**
     * 테이블 row의 height
     */
    rowHeight: PropTypes.number,
    /**
     * 로딩 텍스트
     */
    localeText: PropTypes.object,
    /**
     * row clicked
     */
    onRowClicked: PropTypes.func,
    /**
     * selection이 변경되었을 때(ex, selected 변경, 혹은 체크박스 클릭) 바인드 함수
     */
    onSelectionChanged: PropTypes.func,
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
     * 드래그 기능을 직접 구현하는지 (false시 ag-grid의 unmanaged drag 기능이 동작)
     */
    dragManaged: PropTypes.bool,
    /**
     * row를 드래그할 때 실행하는 함수
     */
    onRowDragMove: PropTypes.func,
    /**
     * row의 드래그가 멈췄을 때 실행하는 함수
     */
    onRowDragEnd: PropTypes.func,
    /**
     * 추가적인 framework components
     */
    frameworkComponents: PropTypes.object,
    /**
     * drag가능한 ag-grid에서 rows 이동 시 애니메이션 효과를 줄지 말지 결정
     */
    animateRows: PropTypes.bool,
    /**
     * 쓰는 곳에서 grid Instance를 state로 관리할 때, gridReady시 state 변경
     */
    setGridInstance: PropTypes.func,
};

const defaultProps = {
    localeText: { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' },
    loading: false,
    paging: true,
    dragManaged: false,
    header: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    preventRowClickCell: [],
    rowSelection: 'single',
    headerHeight: 35,
    animateRows: true,
};

/**
 * 공통 테이블 (ag-grid 사용)
 */
const MokaTable = forwardRef((props, ref) => {
    // table props
    const {
        className,
        columnDefs,
        rowData,
        onRowNodeId,
        agGridHeight,
        localeText,
        onRowClicked,
        onSelectionChanged,
        loading,
        preventRowClickCell,
        rowSelection,
        selected,
        header,
        headerHeight,
        rowHeight,
        frameworkComponents,
        animateRows,
        setGridInstance: setParentGridInstance,
    } = props;

    // drag props
    const { dragManaged, onRowDragMove, onRowDragEnd } = props;

    // paging props
    const { paginationClassName, paging, total, page, size, pageSizes, displayPageNum, onChangeSearchOption, showTotalString } = props;

    // gridApi state
    const [gridApi, setGridApi] = useState(null);

    /**
     * 2020-11-27 09:35 MokaTable 외부에서 selected 값이 바껴도 unseleced가 동작 되지 않아서
     * 아래 처럼 변수에 담아놓고 값이 현재 값과 비교해서 다르면 un seleced 가 되도록 값을 담아 놓음.
     */
    const initSelected = useRef(selected);

    // return ref 설정
    useImperativeHandle(
        ref,
        () => ({
            gridApi: gridApi,
        }),
        [gridApi],
    );

    /**
     * agGrid 로딩 전 인스턴스 설정
     * @param {object} params grid object
     */
    const onGridReady = (params) => {
        setGridApi(params.api);
        if (setParentGridInstance) {
            setParentGridInstance(params);
        }
    };

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
     * usedYn에 따른 row 색상 처리
     * @param {object} instance 인스턴스
     */
    const getRowClass = (instance) => {
        if (instance.node.data.usedYn === 'N') {
            return 'usedyn-n';
        }
        return null;
    };

    /**
     * ag-grid가 화면에 그릴 row data가 변경되었을 때 실행
     * (selected 값이 있을 때 select함)
     *
     * 2020-11-27 09:38 selected 값이 변경 되어도 deselectAll 이 실행 되지 않아서 기존 선택된 ROW 가 유지되는 부분이 있어서 아래 처럼 수정.
     * 혹시 문제가 생기면 아래 기존 소스로 변경 부탁 드립니다.
     */
    const handleSelected = useCallback(() => {
        if (!gridApi) return;
        if (selected || initSelected.current !== selected) {
            gridApi.deselectAll();
            const selectedNode = gridApi.getRowNode(selected);
            if (selectedNode) {
                selectedNode.selectThisNode(true);
                initSelected.current = selected;
            }
        }
    }, [selected, gridApi]);

    // 2020-11-27 09:40 기존 소스.
    // const handleSelected = useCallback(() => {
    //     if (selected && gridApi) {
    //         gridApi.deselectAll();
    //         const selectedNode = gridApi.getRowNode(selected);
    //         if (selectedNode) {
    //             selectedNode.selectThisNode(true);
    //         }
    //     }
    // }, [selected, gridApi]);

    /**
     * selection 변경 시 실행
     * @param {object} params grid
     */
    const handleSelectionChanged = (params) => {
        if (onSelectionChanged) {
            const selectedNodes = params.api.getSelectedNodes();
            onSelectionChanged(selectedNodes, rowSelection);
        }
    };

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
            <div className={clsx('ag-theme-moka-grid', 'position-relative', className, { 'ag-header-no': !header })} style={{ height: `${agGridHeight}px` }}>
                {loading && <MokaLoader />}
                <AgGridReact
                    immutableData
                    columnDefs={columnDefs}
                    rowData={rowData}
                    headerHeight={headerHeight}
                    rowHeight={rowHeight}
                    getRowNodeId={onRowNodeId}
                    animateRows={animateRows}
                    localeText={localeText}
                    onCellClicked={handleCellClicked}
                    onSelectionChanged={handleSelectionChanged}
                    onGridReady={onGridReady}
                    rowSelection={rowSelection}
                    rowDragManaged={dragManaged}
                    suppressMoveWhenRowDragging={dragManaged}
                    suppressMovableColumns
                    onRowDragMove={onRowDragMove}
                    onRowDragEnd={onRowDragEnd}
                    onRowDataUpdated={handleRowDataUpdated}
                    tooltipShowDelay={0}
                    frameworkComponents={{ imageRenderer: ImageRenderer, ...frameworkComponents }}
                    suppressRowClickSelection
                    getRowClass={getRowClass}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    enableMultiRowDragging={rowSelection === 'multiple'}
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
});

MokaTable.propTypes = propTypes;
MokaTable.defaultProps = defaultProps;

export default MokaTable;
