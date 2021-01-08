import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';

import { MokaTableImageRenderer } from '@components';
import { columnDefs, rowClassRules } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from '@pages/Desking/components/DeskingReadyGrid';
import DeskingEditorRenderer from './DeskingEditorRenderer';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { putDeskingWorkListSort } from '@store/desking';
import { findWork, makeHoverBox, getRow, getRowIndex, getMoveMode, clearHoverStyle, clearNextStyle, clearWorkStyle, findNextMainRow, addNextRowStyle } from '@utils/agGridUtil';

let hoverBox = makeHoverBox();

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, onRowClicked, onSave, onDelete, deskingPart } = props;
    const { deskingWorks } = component;
    const dispatch = useDispatch();

    const { IR_URL } = useSelector((store) => ({
        IR_URL: store.app.IR_URL,
    }));

    // state
    const [rowData, setRowData] = useState([]);
    const [, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);
    const [draggingNodeData, setDraggingNodeData] = useState(null);

    useEffect(() => {
        if (!deskingWorks) return;
        if (component?.viewYn === 'N') return;

        setRowData(
            deskingWorks.map((desking) => {
                // 제목 replace
                let escapeTitle = desking.title;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                // 이미지 IR_URL
                let irThumbFileName = '';
                if (desking.thumbFileName) {
                    // 일시적으로 IR_URL 연결 제거
                    // const npLink = desking.thumbFileName.replace(/^https*:\/\//, '');
                    // irThumbFileName = `${IR_URL}?t=k&w=100&h=100u=//${npLink}`;
                    irThumbFileName = desking.thumbFileName;
                }

                return {
                    ...desking,
                    gridType: 'DESKING',
                    componentWorkSeq: component.seq,
                    title: escapeTitle,
                    contentOrdEx: desking.rel ? '' : `0${desking.contentOrd}`.substr(-2),
                    relOrdEx: desking.rel ? `0${desking.relOrd}`.substr(-2) : '',
                    irThumbFileName,
                    onRowClicked,
                    onSave,
                    onDelete,
                    deskingPart,
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deskingWorks]);

    /**
     * cell별 설정에 따라서 RowClick 호출
     * @param {object} params ag-grid data
     */
    const handleCellClicked = useCallback(
        (params) => {
            if (params.colDef.field === 'title' || params.colDef.field === 'relTitle') return;
            onRowClicked(params.node.data, params);
        },
        [onRowClicked],
    );

    /**
     * row selected
     * 주기사 셀렉 시 관련기사 자동 셀렉
     */
    const handleRowSelected = useCallback((params) => {
        if (params.node.data.rel) return;
        let selectedMain = params.api.getSelectedNodes().filter((node) => !node.data.rel);
        let contentIds = selectedMain.map((node) => node.data.contentId);
        params.api.forEachNode((node) => {
            // 관련기사 selected 상태 변경
            if (node.data.rel) {
                node.setSelected(params.node.selected && contentIds.includes(node.data.parentContentId));
            }
        });
    }, []);

    /**
     * 드래그 시작
     */
    const handleRowDragEnter = useCallback((params) => {
        const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
        if (!workElement) return null;
        if (workElement.classList.contains('disabled')) return null;
        workElement.appendChild(hoverBox);

        let selected = params.api.getSelectedNodes();
        if (selected.length < 1 && params.node) {
            // select된 노드가 없는데 드래그 중인 노드가 있으면
            params.node.setSelected(true);
        } else if (!selected.map((node) => node.data.contentId).includes(params.node.data.contentId)) {
            // select된 노드에 드래그 중인 노드가 포함이 안되어있으면
            params.node.setSelected(true);
        }
    }, []);

    /**
     * 주기사간 이동(주기사의 관련기사 포함 이동)
     * @param {*} api agGrid api
     * @param {*} displayedRows 기사목록
     * @param {*} overNode target기사
     */
    const mainToMain = useCallback((api, displayedRows, overNode) => {
        let result = [];

        // selected 정렬
        let selected = api.getSelectedNodes().sort(function (a, b) {
            if (a.data.contentOrd === b.data.contentOrd) {
                if (a.data.relOrd === b.data.relOrd) {
                    return a.data.rel ? 1 : -1;
                } else {
                    return a.data.relOrd - b.data.relOrd;
                }
            } else {
                return a.data.contentOrd - b.data.contentOrd;
            }
        });

        // overNode가 없으면 첫번째 데이터로, 있으면 overNode의 order 밑으로 이동
        // selected 순번 수정
        let contentOrd = !overNode ? 0 : overNode.data.contentOrd;
        selected.forEach((node) => {
            if (!node.data.rel) {
                contentOrd++;
            }
            displayedRows.forEach((a) => {
                if (a.contentId === node.data.contentId) {
                    a.contentOrd = contentOrd;
                }
            });
        });

        // 겹치는 순번에서 selected를 우선으로 정렬
        let selectedSeqs = selected.map((node) => node.data.contentId);
        result = displayedRows.sort(function (a, b) {
            if (a.contentOrd === b.contentOrd) {
                if (a.relOrd === b.relOrd) {
                    if (a.rel === b.rel) {
                        if (selectedSeqs.includes(a.contentId) && selectedSeqs.includes(b.contentId)) {
                            return a.rel ? 1 : -1;
                        } else if (selectedSeqs.includes(a.contentId)) {
                            return -1;
                        } else if (selectedSeqs.includes(b.contentId)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (selectedSeqs.includes(a.contentId) && selectedSeqs.includes(b.contentId)) {
                            return a.rel ? 1 : -1;
                        } else if (selectedSeqs.includes(a.contentId)) {
                            return -1;
                        } else if (selectedSeqs.includes(b.contentId)) {
                            return 1;
                        } else {
                            return a.rel ? 1 : -1;
                        }
                    }
                } else {
                    if (selectedSeqs.includes(a.contentId) && selectedSeqs.includes(b.contentId)) {
                        return a.rel ? 1 : -1;
                    } else if (selectedSeqs.includes(a.contentId)) {
                        return -1;
                    } else if (selectedSeqs.includes(b.contentId)) {
                        return 1;
                    } else {
                        return a.relOrd - b.relOrd;
                    }
                }
            } else {
                return a.contentOrd - b.contentOrd;
            }
        });

        // 기사의 contentOrd 순번 1부터 지정
        contentOrd = 0;
        result.forEach((node) => {
            if (!node.rel) {
                contentOrd++;
            }
            node.contentOrd = contentOrd;
        });

        return result;
    }, []);

    /**
     * 패밀리내에서 관련기사간 이동
     * @param {} draggingNode 이동하는 기사
     * @param {*} displayedRows 기사목록
     * @param {*} overNode target기사
     */
    const relToRel = (draggingNode, displayedRows, overNode) => {
        // overNode기준으로 source의 순번을 조정
        let relOrd = overNode.data.relOrd + 1;
        displayedRows.forEach((a) => {
            if (a.parentContentId === draggingNode.data.parentContentId && a.contentId === draggingNode.data.contentId) {
                a.relOrd = relOrd;
            }
        });

        // 겹치는 순번에서 draggingNode를 우선으로 정렬
        let result = displayedRows.sort(function (a, b) {
            if (a.contentOrd === b.contentOrd) {
                if (a.relOrd === b.relOrd) {
                    if (draggingNode.data.contentId === b.contentId) {
                        return 1;
                    } else if (draggingNode.data.contentId === a.contentId) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    return a.relOrd - b.relOrd;
                }
            } else {
                return a.contentOrd - b.contentOrd;
            }
        });

        // 순번 1부터 지정
        relOrd = 1;
        result.forEach((node) => {
            if (node.rel) {
                if (node.parentContentId === draggingNode.data.parentContentId) {
                    node.relOrd = relOrd;
                    relOrd++;
                }
            }
        });

        return result;
    };

    /**
     * 패밀리내에서 관련기사를 주기사로 이동
     * @param {} draggingNode 이동하는 기사
     * @param {*} displayedRows 기사목록
     * @param {*} overNode target기사
     */
    const relToMain = (draggingNode, displayedRows, overNode) => {
        let moveForward = draggingNode.childIndex > overNode.childIndex;
        let forwardNode = moveForward ? overNode : draggingNode;
        let backwardNode = moveForward ? draggingNode : overNode;

        let firstArr = displayedRows.splice(0, forwardNode.childIndex);
        let secondArr = displayedRows.splice(0, 1); // forwardNode(주기사 1건)
        let thirdArr = displayedRows.splice(0, backwardNode.childIndex - firstArr.length - secondArr.length); // 가운데 관련기사
        let fourthArr = displayedRows.splice(0, 1); // backwardNode(교체하는 관련기사 1건)
        let fifthArr = displayedRows.splice(0, forwardNode.data.relSeqs.length - thirdArr.length - fourthArr.length); // 남은 관련기사
        let lastArr = displayedRows;

        secondArr = secondArr.map((node) => ({
            ...node,
            parentContentId: backwardNode.data.contentId,
            rel: true,
            relOrd: backwardNode.data.relOrd,
            relSeqs: null,
        }));
        thirdArr = thirdArr.map((node) => ({
            ...node,
            parentContentId: backwardNode.data.contentId,
        }));
        fifthArr = fifthArr.map((node) => ({
            ...node,
            parentContentId: backwardNode.data.contentId,
        }));
        fourthArr = fourthArr.map((node) => ({
            ...node,
            parentContentId: null,
            rel: false,
            relOrd: 1,
            contentOrd: forwardNode.data.contentOrd,
            relSeqs: secondArr
                .concat(thirdArr)
                .concat(fifthArr)
                .map((a) => a.seq),
        }));

        // 순서 변경 (2 <-> 4)
        let result = firstArr.concat(fourthArr).concat(thirdArr).concat(secondArr).concat(fifthArr).concat(lastArr);

        return result;
    };

    /**
     * 관련기사 추가
     */
    const appendRelRows = useCallback(
        (api, type, draggingNode, overNode) => {
            // display 기준으로 새로운 rows생성
            let displayedRows = [],
                result = [];
            for (let i = 0; i < api.getDisplayedRowCount(); i++) {
                displayedRows.push(api.getDisplayedRowAtIndex(i).data);
            }

            if (type === 'mainToMain') {
                result = mainToMain(api, displayedRows, overNode);
            } else if (type === 'relToRel') {
                result = relToRel(draggingNode, displayedRows, overNode);
            } else if (type === 'relToMain') {
                result = relToMain(draggingNode, displayedRows, overNode);
            }

            // api.setRowData([]);
            setDraggingNodeData(draggingNode.data);
            dispatch(
                putDeskingWorkListSort({
                    componentWorkSeq: component.seq,
                    datasetSeq: component.datasetSeq,
                    list: result,
                    callback: ({ header }) => {
                        if (header.success) {
                            api.deselectAll();
                        }
                    },
                }),
            );
        },
        [component.datasetSeq, component.seq, dispatch, mainToMain],
    );

    /**
     * 드래그 move
     * 이동 가능) 주기사의 관련기사 <=> 관련기사, 주기사 <=> 주기사, 관련기사 => 주기사
     * 이동 불가) 주기사 => 본인 관련기사, 주기사 => 타 관련기사, 관련기사 => 타 주기사, 관련기사 <=> 타 관련기사
     */
    const handleDragMove = useCallback(
        (params) => {
            const draggingNode = getRow(params.event);
            if (!draggingNode) return;

            const draggingIdx = draggingNode.getAttribute('row-index');
            const overNodeData = params.overNode.data;
            setHoverNode(draggingNode);

            if (hoverNode && hoverNode.getAttribute('row-index') !== draggingIdx) {
                clearHoverStyle(hoverNode);
                clearNextStyle(nextNode);
            }

            if (params.node.data.rel) {
                // 관련기사 드래그)
                if (overNodeData.parentContentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('hover');
                } else if (overNodeData.contentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('change');
                }
            } else {
                // 주기사 드래그
                if (!overNodeData.rel && (!overNodeData.relSeqs || overNodeData.relSeqs.length < 1)) {
                    draggingNode.classList.add('hover');
                } else {
                    const nextRow = findNextMainRow(draggingNode);
                    addNextRowStyle(nextRow);
                    nextRow.node && setNextNode(nextRow.node);
                }
            }
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 leave
     */
    const handleRowDragLeave = useCallback(
        (params) => {
            clearHoverStyle(hoverNode);
            clearNextStyle(nextNode);
            const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
            if (!workElement) return null;
            if (workElement.classList.contains('disabled')) return null;

            const elements = document.elementsFromPoint(params.event.clientX, params.event.clientY);
            if (!elements.find((e) => e.classList.contains('button-group'))) {
                workElement.removeChild(hoverBox);
                clearWorkStyle(workElement);
            }
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 종료
     */
    const handleRowDragEnd = useCallback(
        (params) => {
            const draggingNode = params.node;
            let overNode = params.api.getDisplayedRowAtIndex(getRowIndex(params.event));
            const sameNode = draggingNode === overNode;

            handleRowDragLeave(params);
            if (sameNode) return;

            let rollback = true,
                type = '';
            if (draggingNode.data.rel) {
                // 관련기사인 경우 (같은 주기사 내, 주기사 <=> 관련기사 교체)
                if (overNode.data.parentContentId === draggingNode.data.parentContentId) {
                    rollback = false;
                    type = 'relToRel';
                } else if (overNode.data.contentId === draggingNode.data.parentContentId) {
                    rollback = false;
                    type = 'relToMain';
                }
            } else {
                // 주기사인 경우 (주기사끼리만 이동가능)
                if (getMoveMode(draggingNode)) {
                    if (overNode.data.rel) {
                        const maybeSame = params.api.getRowNode(overNode.data.parentContentId);
                        if (draggingNode.data.contentId !== maybeSame.data.contentId) {
                            rollback = false;
                            type = 'mainToMain';
                            overNode = maybeSame;
                        }
                    } else if (draggingNode.data.contentId !== overNode.data.contentId) {
                        rollback = false;
                        type = 'mainToMain';
                    }
                }
            }

            if (rollback) {
                toast.warning('이동할 수 없습니다');
                params.api.deselectAll();
                return;
            }

            appendRelRows(params.api, type, draggingNode, overNode);
        },
        [appendRelRows, handleRowDragLeave],
    );

    /**
     * row data 업데이트 후 실행
     */
    const handleRowDataUpdated = useCallback(
        (params) => {
            setTimeout(function () {
                params.api.refreshCells({ force: true });

                if (draggingNodeData) {
                    let arr = [];
                    params.api.forEachNode((node) => {
                        if (node.data.contentId === draggingNodeData.contentId || node.data.parentContentId === draggingNodeData.contentId) {
                            arr.push(node);
                        }
                    });
                    params.api.resetRowHeights();
                    setHoverNode(null);
                    setNextNode(null);
                    setDraggingNodeData(null);
                }
            });
        },
        [draggingNodeData],
    );

    /**
     * row height 제어 (관련기사는 height가 작음)
     * @param {object} params ag-grid instance
     */
    const getRowHeight = useCallback((params) => {
        return params.data.rel ? 42 : 53;
    }, []);

    /**
     * ag-grid onGridReady
     * @param {object} params onGridReady params
     */
    const handleGridReady = useCallback(
        (params) => {
            setComponentAgGridInstances(
                produce(componentAgGridInstances, (draft) => {
                    draft[agGridIndex] = params;
                }),
            );
            setGridInstance(params);

            // 컴포넌트 워크 타이틀에 드롭존 추가
            const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
            const titleElement = workElement.querySelector('.button-group');
            if (!workElement) return null;
            const dropzone = {
                getContainer: () => titleElement,
                onDragEnter: (source) => {
                    if (!source.node.data.rel) {
                        // 주기사만 가능
                        if (!workElement.querySelector('.is-over')) {
                            workElement.appendChild(hoverBox);
                        }
                        workElement.classList.add('hover');
                    }
                },
                onDragLeave: (source) => {
                    clearWorkStyle(workElement);
                    if (source.type === 'rowDragEnd') {
                        workElement.removeChild(hoverBox);
                    } else {
                        const elements = document.elementsFromPoint(source.event.clientX, source.event.clientY);
                        if (!elements.find((e) => e.classList.contains('component-work'))) {
                            workElement.removeChild(hoverBox);
                        }
                    }
                },
                onDragStop: (source) => {
                    let displayedRows = [];

                    for (let i = 0; i < params.api.getDisplayedRowCount(); i++) {
                        displayedRows.push(params.api.getDisplayedRowAtIndex(i).data);
                    }

                    // 첫번째로 데이터 추가
                    const result = mainToMain(source.api, displayedRows, null);
                    setDraggingNodeData(source.node.data);
                    dispatch(
                        putDeskingWorkListSort({
                            componentWorkSeq: component.seq,
                            datasetSeq: component.datasetSeq,
                            list: result,
                            callback: ({ header }) => {
                                if (header.success) {
                                    params.api.deselectAll();
                                }
                            },
                        }),
                    );
                    dropzone.onDragLeave(source);
                },
            };
            params.api.removeRowDropZone(dropzone);
            params.api.addRowDropZone(dropzone);
        },
        [agGridIndex, component.datasetSeq, component.seq, componentAgGridInstances, dispatch, mainToMain, setComponentAgGridInstances],
    );

    return (
        <div className="ag-theme-moka-desking-grid position-relative px-1">
            {component.viewYn === 'N' && <div className="opacity-box"></div>}
            <AgGridReact
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.contentId}
                columnDefs={columnDefs}
                localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                onRowDragEnter={handleRowDragEnter}
                onRowDragEnd={handleRowDragEnd}
                onRowDragMove={handleDragMove}
                onRowDragLeave={handleRowDragLeave}
                onRowSelected={handleRowSelected}
                rowSelection="multiple"
                animateRows
                rowDragManaged={false}
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                suppressHorizontalScroll
                onCellClicked={handleCellClicked}
                onRowDataUpdated={handleRowDataUpdated}
                headerHeight={0}
                rowClassRules={rowClassRules}
                getRowHeight={getRowHeight}
                frameworkComponents={{ imageRenderer: MokaTableImageRenderer, editor: DeskingEditorRenderer }}
            />
            {componentAgGridInstances[agGridIndex] && <DeskingReadyGrid componentAgGridInstances={componentAgGridInstances} agGridIndex={agGridIndex} component={component} />}
        </div>
    );
};

export default DeskingWorkAgGrid;
