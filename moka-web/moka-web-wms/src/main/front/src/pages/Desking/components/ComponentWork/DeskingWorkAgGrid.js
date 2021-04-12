import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { MokaTableFullImageRenderer } from '@components';
import { columnDefs, rowClassRules, naverChannelColumnDefs } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from '@pages/Desking/components/DeskingReadyGrid';
import DeskingEditorRenderer from './DeskingEditorRenderer';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { putDeskingWorkListSort } from '@store/desking';
import { getRow, getRowIndex, classElementsFromPoint, autoScroll, getDisplayedRows } from '@utils/agGridUtil';
import { findWork, makeHoverBox, getMoveMode, clearHoverStyle, clearNextStyle, clearWorkStyle, findNextMainRow, addNextRowStyle } from '@utils/deskingUtil';

let hoverBox = makeHoverBox();

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, onRowClicked, onSave, onDelete, deskingPart, isNaverChannel = false } = props;
    const { deskingWorks } = component;
    const dispatch = useDispatch();
    // const IR_URL = useSelector(({ app }) => app.IR_URL);

    // state
    const [rowData, setRowData] = useState([]);
    const [, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);
    const [onTitle, setOnTitle] = useState(false);
    const [draggingNodeData, setDraggingNodeData] = useState(null);

    /**
     * cell별 설정에 따라서 RowClick 호출
     * @param {object} params ag-grid data
     */
    const handleCellClicked = useCallback(
        (params) => {
            if (params.colDef.field === 'relOrdEx' || params.colDef.field === 'contentOrdEx' || params.colDef.field === 'title' || params.colDef.field === 'relTitle') return;
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
     * @param {object} api agGrid api
     * @param {array} displayedRows 기사목록
     * @param {object} overNode target기사
     */
    const mainToMain = useCallback((api, displayedRows, overNode) => {
        const sds = api.getSelectedNodes().map((node) => node.data); // 선택한 노드 데이터 (순서 변경 대상)
        const mt = displayedRows.filter((con) => !sds.find((s) => s.contentId === con.contentId)); // 유지되는 데이터
        const maintain = { main: mt.filter((d) => !d.rel), rel: mt.filter((d) => d.rel) }; // 유지되는 데이터를 주기사, 관련기사 나눔
        let result = [...maintain.main];

        // 선택한 노드 데이터를 주기사, 관련기사 나눔
        let selected = {
            main: sds
                .filter((d) => !d.rel)
                .sort(function (a, b) {
                    return a.contentOrd - b.contentOrd;
                }),
            rel: sds.filter((d) => d.rel),
        };

        // overNode가 없으면 첫번째 데이터로, 있으면 overNode 밑으로 이동 (contentOrd로 체크하지 않음, contentOrd에는 빠지는 row가 반영되어 있지 않음)
        let insertOrd = !overNode ? 0 : maintain.main.findIndex((m) => m.contentId === overNode.data.contentId) + 1;
        result.splice(insertOrd, 0, ...selected.main);
        result = result.map((r, idx) => ({ ...r, contentOrd: idx + 1 }));

        // 관련기사를 주기사 사이사이에 추가 (부모키 별 관련기사 나누고 contentOrd 셋팅해서 끼워넣음)
        const allRel = [...maintain.rel, ...selected.rel].reduce((all, cu) => ({ ...all, [cu.parentContentId]: [...(all[cu.parentContentId] || []), cu] }), {});
        Object.keys(allRel).forEach((parentContentId) => {
            const pidx = result.findIndex((m) => m.contentId === parentContentId);
            const nr = allRel[parentContentId].map((p) => ({ ...p, contentOrd: result[pidx].contentOrd }));
            result.splice(pidx + 1, 0, ...nr);
        });

        return result;
    }, []);

    /**
     * 관련기사 간 이동
     * @param {object} draggingNode 이동하는 기사
     * @param {array} displayedRows 기사목록
     * @param {object} overNode target기사
     */
    const relToRel = useCallback((draggingNode, displayedRows, overNode) => {
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
        result.forEach((node, idx) => {
            if (node.rel && node.parentContentId === draggingNode.data.parentContentId) {
                node.relOrd = idx + 1;
            }
        });

        return result;
    }, []);

    /**
     * 관련기사와 주기사 변경
     * @param {object} draggingNode 이동하는 기사
     * @param {array} displayedRows 기사목록
     * @param {object} overNode target기사
     */
    const relToMain = useCallback((draggingNode, displayedRows, overNode) => {
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
    }, []);

    /**
     * 기사 추가
     */
    const appendRows = useCallback(
        (api, type, draggingNode, overNode) => {
            // display 기준으로 새로운 rows생성
            let result = [];
            let displayedRows = getDisplayedRows(api);

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
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                        api.deselectAll();
                    },
                }),
            );
        },
        [component.datasetSeq, component.seq, dispatch, mainToMain, relToRel, relToMain],
    );

    /**
     * 드래그 move
     * 이동 가능) 주기사의 관련기사 <=> 관련기사, 주기사 <=> 주기사, 관련기사 => 주기사
     * 이동 불가) 주기사 => 본인 관련기사, 주기사 => 타 관련기사, 관련기사 => 타 주기사, 관련기사 <=> 타 관련기사
     */
    const handleDragMove = useCallback(
        (params) => {
            const scrollBox = classElementsFromPoint(params.event, 'scrollable');
            autoScroll(scrollBox, { clientX: params.event.clientX, clientY: params.event.clientY });

            // node 데이터 분석해서 처리 하는 부분
            const overNode = getRow(params.event);
            if (!overNode) return;

            const draggingIdx = overNode.getAttribute('row-index');
            const gridOverNodeData = params.overNode.data;
            setHoverNode(overNode);

            if (hoverNode && hoverNode.getAttribute('row-index') !== draggingIdx) {
                clearHoverStyle(hoverNode);
                clearNextStyle(nextNode);
            }

            if (params.node.data.rel) {
                // 관련기사 드래그)
                if (gridOverNodeData.parentContentId === params.node.data.parentContentId) {
                    overNode.classList.add('hover');
                } else if (gridOverNodeData.contentId === params.node.data.parentContentId) {
                    overNode.classList.add('change');
                }
            } else {
                // 주기사 드래그
                if (!gridOverNodeData.rel && (!gridOverNodeData.relSeqs || gridOverNodeData.relSeqs.length < 1)) {
                    overNode.classList.add('hover');
                } else {
                    const nextRow = findNextMainRow(overNode);
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
            if (!onTitle) {
                const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
                if (!workElement) return;
                if (workElement.classList.contains('disabled')) return;
                if (workElement.contains(hoverBox)) {
                    workElement.removeChild(hoverBox);
                    clearWorkStyle(workElement);
                }
            }
        },
        [hoverNode, nextNode, onTitle],
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
            if (sameNode) {
                params.api.deselectAll();
                return;
            }

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

            appendRows(params.api, type, draggingNode, overNode);
        },
        [appendRows, handleRowDragLeave],
    );

    /**
     * row data 업데이트 후 실행
     */
    const handleRowDataUpdated = useCallback(
        (params) => {
            setTimeout(function () {
                if (draggingNodeData) {
                    let arr = [];
                    params.api.forEachNode((node) => {
                        if (node.data.contentId === draggingNodeData.contentId || node.data.parentContentId === draggingNodeData.contentId) {
                            arr.push(node);
                        }
                    });
                    params.api.redrawRows({ rowNodes: arr });
                    params.api.resetRowHeights();
                    setHoverNode(null);
                    setNextNode(null);
                    setDraggingNodeData(null);
                } else {
                    params.api.redrawRows();
                    // params.api.refreshCells({
                    //     columns: ['relOrdEx', 'checkbox', 'relTitle', 'contentOrdEx', 'irThumbFileName', 'title'],
                    //     force: true,
                    // });
                    params.api.resetRowHeights();
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
     * 1) componentAgGridInstances에 grid 추가
     * 2) .button-group 드롭존 추가
     * @param {object} params onGridReady params
     */
    const handleGridReady = useCallback(
        (params) => {
            setComponentAgGridInstances(
                produce(componentAgGridInstances, (draft) => {
                    draft[agGridIndex] = {
                        ...params,
                        component,
                    };
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
                        setOnTitle(true);
                    }
                },
                onDragLeave: () => {
                    if (!draggingNodeData) {
                        clearWorkStyle(workElement);
                        if (workElement.querySelector('.is-over')) {
                            workElement.removeChild(hoverBox);
                        }
                    }
                    setOnTitle(false);
                },
                onDragStop: (source) => {
                    if (!source.node.data.rel && source.node.childIndex > 0) {
                        // 주기사이고 첫번째 기사 아닌 것만 이동
                        let displayedRows = getDisplayedRows(params.api);

                        // 첫번째로 데이터 추가
                        const result = mainToMain(source.api, displayedRows, null);
                        setDraggingNodeData(source.node.data);
                        dispatch(
                            putDeskingWorkListSort({
                                componentWorkSeq: component.seq,
                                datasetSeq: component.datasetSeq,
                                list: result,
                                callback: () => params.api.deselectAll(),
                            }),
                        );
                    }
                    source.api.deselectAll();
                    dropzone.onDragLeave(source);
                },
            };
            params.api.removeRowDropZone(dropzone);
            params.api.addRowDropZone(dropzone);
        },
        [agGridIndex, component, componentAgGridInstances, dispatch, draggingNodeData, mainToMain, setComponentAgGridInstances],
    );

    useEffect(() => {
        if (!deskingWorks) return;
        if (component?.viewYn === 'N') return;

        setRowData(
            deskingWorks.map((desking) => {
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
                    isDesking: true,
                    componentWorkSeq: component.seq,
                    title: unescapeHtmlArticle(desking.title),
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

    return (
        <div className={clsx('ag-theme-moka-dnd-grid desking-grid position-relative px-1', { 'naver-channel': isNaverChannel })}>
            {component.viewYn === 'N' && <div className="opacity-box"></div>}
            <AgGridReact
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.contentId}
                columnDefs={isNaverChannel ? naverChannelColumnDefs : columnDefs}
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
                frameworkComponents={{ fullImageRenderer: MokaTableFullImageRenderer, editor: DeskingEditorRenderer }}
            />
            {componentAgGridInstances[agGridIndex] && <DeskingReadyGrid componentAgGridInstances={componentAgGridInstances} agGridIndex={agGridIndex} component={component} />}
        </div>
    );
};

export default DeskingWorkAgGrid;
