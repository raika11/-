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

export const makeDeskingWorkDropzone = (onDragStop, targetGrid, currentIndex) => {
    let loader = document.createElement('div');
    loader.classList.add('is-over');

    const workElement = findWork(targetGrid.api.gridOptionsWrapper.layoutElements[0]); // .component-work
    let hoverIdx = -1;
    let hoverRow = null;

    const dropZone = {
        getContainer: () => workElement,
        onDragEnter: () => workElement.appendChild(loader),
        onDragLeave: () => workElement.removeChild(loader),
        onDragging: (source) => {
            let tmpRow = getRow(source.event);

            if (tmpRow) {
                let tmpIdx = tmpRow.getAttribute('row-index');

                if (hoverIdx !== tmpIdx) {
                    const selected = targetGrid.api.getSelectedRows();

                    if (selected.length < 1) {
                        // 주기사만
                        if (!tmpRow.classList.contains('ag-rel-row')) {
                            console.log(tmpIdx);
                            if (hoverRow) hoverRow.classList.remove('hover');
                            tmpRow.classList.add('hover');
                            hoverIdx = tmpIdx;
                            hoverRow = tmpRow;
                        }
                    } else {
                        // 관련기사만
                        if (tmpRow.classList.contains('ag-rel-row')) {
                            console.log(tmpIdx);
                            if (hoverRow) hoverRow.classList.remove('hover');
                            tmpRow.classList.add('hover');
                            hoverIdx = tmpIdx;
                            hoverRow = tmpRow;
                        }
                    }
                }
            } else {
                hoverIdx = -1;
                if (hoverRow) {
                    hoverRow.classList.remove('hover');
                    hoverRow = null;
                }
            }
        },
        onDragStop: (source) => {
            if (onDragStop) {
                onDragStop(source, targetGrid, currentIndex);
            }
            workElement.removeChild(loader);
        },
    };

    return dropZone;
};
