/**
 * 마우스 위치에 따른 row 찾는 함수
 * @param {object} event 드래그 이벤트
 */
export const getRow = (event) => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const agGridRow = elements.find((r) => r.classList.contains('ag-row'));
    return agGridRow;
};

/**
 * 마우스 위치에 따른 row index 찾는 함수
 * @param {object} event 드래그 이벤트
 */
export const getRowIndex = (event) => {
    const agGridRow = getRow(event);
    if (agGridRow) {
        const index = agGridRow.getAttribute('row-index');
        return Number(index);
    }
    return -1;
};

const findWork = (node) => (node && node.classList.contains('component-work') ? node : node.parentElement ? findWork(node.parentElement) : null);

const findNextMainRow = (node) => {
    let result = { type: 'none', node: null };
    if (node) {
        const friend = [...node.parentNode.childNodes]
            .filter((a) => a.getAttribute('row-index') > node.getAttribute('row-index'))
            .sort(function (a, b) {
                const aIdx = Number(a.getAttribute('row-index'));
                const bIdx = Number(b.getAttribute('row-index'));
                return aIdx - bIdx;
            });

        for (let i = 0; i < friend.length; i++) {
            if (!friend[i].classList.contains('ag-rel-row')) {
                result = { type: 'next', node: friend[i] };
                break;
            } else {
                if (i === friend.lenght - 1) {
                    result = { type: 'last', node: friend[i] };
                }
            }
        }
    }
    return result;
};

const findPreviousMainRow = (node) => {
    let result = { type: 'none', node: null };
    if (node) {
        const friend = [...node.parentNode.childNodes]
            .filter((a) => a.getAttribute('row-index') < node.getAttribute('row-index'))
            .sort(function (a, b) {
                const aIdx = Number(a.getAttribute('row-index'));
                const bIdx = Number(b.getAttribute('row-index'));
                return aIdx - bIdx;
            });

        for (let i = friend.length - 1; i >= 0; i--) {
            if (!friend[i].classList.contains('ag-rel-row')) {
                result = { type: 'prev', node: friend[i] };
                break;
            } else {
                if (i === 0) {
                    result = { type: 'first', node: friend[i] };
                }
            }
        }
    }
    return result;
};

const makeHoverBox = () => {
    let hoberBox = document.createElement('div');
    hoberBox.classList.add('is-over');
    return hoberBox;
};

/**
 * 데스킹 워크 ag-grid에 추가할 dropzone 을 생성해주는 함수
 * @param {func} onDragStop drag stop 시 실행하는 함수
 * @param {object} targetGrid drop target
 * @param {number} currentIndex 타겟 grid리스트에서 현재 넘어온 타겟 grid의 인덱스 (있으면 넘긴다)
 */
export const makeDeskingWorkDropzone = (onDragStop, targetGrid, currentIndex) => {
    const workElement = findWork(targetGrid.api.gridOptionsWrapper.layoutElements[0]); // .component-work
    let next = { idx: -1, node: null };
    let hover = { idx: -1, node: null };
    let hoverBox = makeHoverBox();

    const clearNextStyle = () => next.node && next.node.classList.remove('next');
    const clearHoverStyle = () => hover.node && hover.node.classList.remove('hover');

    const dropzone = {
        getContainer: () => workElement,
        onDragEnter: () => workElement.appendChild(hoverBox),
        onDragLeave: () => {
            workElement.removeChild(hoverBox);
            clearHoverStyle();
            clearNextStyle();
        },
        onDragging: (source) => {
            let draggingRow = getRow(source.event);
            if (!draggingRow) return;

            let draggingIdx = draggingRow.getAttribute('row-index');
            if (hover.idx !== draggingIdx) {
                clearNextStyle();
                clearHoverStyle();
                hover = { idx: draggingIdx, node: draggingRow };

                const selected = targetGrid.api.getSelectedRows();
                if (selected.length < 1) {
                    // 주기사 추가
                    if (draggingRow.classList.contains('ag-row-last')) {
                        draggingRow.classList.add('hover');
                    } else {
                        const nextRow = findNextMainRow(draggingRow);
                        if (nextRow.type === 'none') return;
                        next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
                        if (nextRow.type === 'next') {
                            nextRow.node.classList.add('next');
                        } else if (nextRow.type === 'last') {
                            nextRow.node.classList.remove('hover');
                            nextRow.node.classList.add('next');
                        }
                    }
                } else {
                    // 관련기사 추가
                    if (!draggingRow.classList.contains('ag-rel-row')) {
                        if (draggingRow.classList.contains('ag-row-last')) {
                            draggingRow.classList.add('hover');
                        } else if (draggingRow.classList.contains('ag-row-selected')) {
                            draggingRow.classList.add('hover');
                        } else {
                            const nextRow = findNextMainRow(draggingRow);
                            if (nextRow.type === 'none') return;
                            next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
                            if (nextRow.type === 'next') {
                                nextRow.node.classList.add('next');
                            } else if (nextRow.type === 'last') {
                                nextRow.node.classList.remove('hover');
                                nextRow.node.classList.add('next');
                            }
                        }
                    } else {
                        const mainRow = findPreviousMainRow(draggingRow);
                        if (mainRow.type === 'prev') {
                            const drs = targetGrid.api.getDisplayedRowAtIndex(Number(mainRow.node.getAttribute('row-index')));
                            if (drs.isSelected()) {
                                draggingRow.classList.add('hover');
                            } else {
                                const nextRow = findNextMainRow(draggingRow);
                                if (nextRow.type === 'none') return;
                                next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
                                if (nextRow.type === 'next') {
                                    nextRow.node.classList.add('next');
                                } else if (nextRow.type === 'last') {
                                    nextRow.node.classList.remove('hover');
                                    nextRow.node.classList.add('next');
                                }
                            }
                        }
                    }
                }
            }
        },
        onDragStop: (source) => {
            if (onDragStop) {
                onDragStop(source, targetGrid, currentIndex);
            }
            dropzone.onDragLeave();
        },
    };

    return dropzone;
};
