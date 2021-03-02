import React, { useEffect, useState, useCallback } from 'react';
import produce from 'immer';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import { columnDefs } from './HotClickAgGridColumns';
import { getRow, getRowIndex, getDisplayedRows, classElementsFromPoint, autoScroll } from '@utils/agGridUtil';
import { findWork, makeHoverBox, findNextMainRow, clearHoverStyle, clearNextStyle } from '@utils/deskingUtil';
import { changeHotClickList, changeHotClickListItem } from '@store/bulks';
import useDebounce from '@hooks/useDebounce';
import commonUtil from '@utils/commonUtil';

let hoverBox = makeHoverBox();

/**
 * 아티클 핫클릭 ag-grid
 */
const BulkhHotClicAgGrid = ({ setComponentAgGridInstances }) => {
    const dispatch = useDispatch();
    const { hotClickList } = useSelector((store) => ({
        hotClickList: store.bulks.bulkh.hotclickList.list,
    }));
    const [rowData, setRowData] = useState([]);
    // const [gridApi, setGridApi] = useState();
    const [, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);

    /**
     * 그리드 생성 시 실행
     */
    const handleGridReady = (params) => {
        // setGridApi(params.api);
        setComponentAgGridInstances(params);
        setGridInstance(params);
    };

    /**
     * 드래그 시작
     */
    const onRowDragEnter = useCallback((params) => {
        const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
        if (!workElement) return null;
        if (workElement.classList.contains('disabled')) return null;
        workElement.appendChild(hoverBox);
        params.node.setSelected(true);
    }, []);

    /**
     * 드래그 영역 밖으로 벗어난 경우, hover css 초기화.
     */
    const onRowDragLeave = useCallback(
        (params) => {
            clearHoverStyle(hoverNode);
            clearNextStyle(nextNode);
            findWork(params.api.gridOptionsWrapper.layoutElements[0]).removeChild(hoverBox);
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 종료
     */
    const onRowDragEnd = useCallback(
        (params) => {
            const draggingNode = params.node;
            let overNode = params.api.getDisplayedRowAtIndex(getRowIndex(params.event));
            const sameNode = draggingNode === overNode;

            onRowDragLeave(params);
            if (sameNode) {
                return;
            }

            // 위치변경 이벤트가 발생 하면 실제 데이터를 재배열 해준다. => 2개만 바꾸는게 아니라 전체 데이터가 다 밀려야함.
            const displayedRows = getDisplayedRows(params.api);
            const result = produce(displayedRows, (draft) => {
                // draggingNode 먼저 제거
                draft.splice(draggingNode.rowIndex, 1);
                // overNode 위치에 draggingNode 추가
                draft.splice(overNode.rowIndex + 1, 0, draggingNode.data);
            });

            setRowData(result);
        },
        [onRowDragLeave],
    );

    /**
     * 드래그 중 (css 변경)
     */
    const onRowDragMove = useCallback(
        (params) => {
            const scrollBox = classElementsFromPoint(params.event, 'scrollable');
            autoScroll(scrollBox, { clientX: params.event.clientX, clientY: params.event.clientY });

            // node 데이터 분석해서 처리 하는 부분
            const overNode = getRow(params.event);
            if (!overNode) return;

            const overNodeIndex = overNode.getAttribute('row-index');
            setHoverNode(overNode);

            if (hoverNode && hoverNode.getAttribute('row-index') !== overNodeIndex) {
                clearHoverStyle(hoverNode);
                clearNextStyle(nextNode);
            }

            overNode.classList.add('hover');
            const nextRow = findNextMainRow(overNode);
            nextRow.node && setNextNode(nextRow.node);
        },
        [hoverNode, nextNode],
    );

    /**
     * 그리드 위치가 변경 되고 state 에 순서가 현재랑 다를 경우만 store 의 리스트도 같이 변경 해준다. ( 저장 할때 변경된 순서로 api 호출.)
     */
    const handleRowDataUpdated = useCallback(
        (params) => {
            // 순서가 변경 되었을 경우에.
            // 스토어 temp리스트(hotClickTempList) 와 현재 리스트 스테이트(rowData) 리스트가
            // 다를 경우만 store temp 리스트를 업데이트 하기.
            if (
                JSON.stringify(
                    rowData.map((e) => {
                        return { totalId: e.totalId, title: e.item.title, url: e.item.url };
                    }),
                ) !==
                JSON.stringify(
                    hotClickList.map((e) => {
                        return { totalId: e.totalId, title: e.title, url: e.url };
                    }),
                )
            ) {
                setTimeout(function () {
                    params.api.refreshCells({ force: true });

                    dispatch(
                        changeHotClickList(
                            rowData.map((e) => {
                                return {
                                    totalId: e.totalId,
                                    title: e.item.title,
                                    url: e.item.url,
                                };
                            }),
                        ),
                    );
                });
            }
            params.api.refreshCells({ force: true });
        },
        [dispatch, hotClickList, rowData],
    );

    const handleChangeListItem = useDebounce((item) => {
        dispatch(changeHotClickListItem(item));
    });

    useEffect(() => {
        // 스토어가 변경 되면 grid 리스트를 업데이트.
        /*const SetRowData = async (data) => {
            setRowData(
              hotClickList.map((e, index) => ({
                    dataIndex: index,
                    ordNo: `0${index + 1}`.substr(-2),
                    totalId: e.totalId,
                    title: e.title,
                    item: {
                        itemIndex: index,
                        title: e.title,
                        url: e.url,
                    },
                    onChange: handleChangeListItem,
                })),
            );
        };
        console.log(hotClickList);
        if (!commonUtil.isEmpty(hotClickList)) {
            SetRowData(hotClickList);
        }*/
        if (!commonUtil.isEmpty(hotClickList)) {
            console.log(hotClickList);
            setRowData(
                hotClickList.map((e, index) => ({
                    dataIndex: index,
                    ordNo: `0${index + 1}`.substr(-2),
                    totalId: e.totalId,
                    title: e.title,
                    item: {
                        itemIndex: index,
                        title: e.title,
                        url: e.url,
                    },
                    onChange: handleChangeListItem,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotClickList]);

    return (
        <div className="ag-theme-moka-dnd-grid desking-grid bulk-hot-click">
            <AgGridReact
                key="grid"
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.dataIndex}
                columnDefs={columnDefs}
                localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                onRowDragEnter={onRowDragEnter}
                onRowDragEnd={onRowDragEnd}
                onRowDragMove={onRowDragMove}
                onRowDragLeave={onRowDragLeave}
                animateRows
                rowDragManaged={false}
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                suppressHorizontalScroll
                onRowDataUpdated={handleRowDataUpdated}
                headerHeight={0}
                rowHeight={84}
            />
        </div>
    );
};

export default BulkhHotClicAgGrid;
