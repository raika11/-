import { getRow, classElementsFromPoint, autoScroll } from '@utils/agGridUtil';

/**
 * .component-work 찾음
 * @param {*} node node
 */
export const findWork = (node) => (node && node.classList.contains('component-work') ? node : node.parentElement ? findWork(node.parentElement) : null);

/**
 * 현재 node 기준으로 다음 메인 기사 찾아서 리턴
 * @param {*} node node
 * @returns {object} { type: none|last|last-rel|next, node: node }
 */
export const findNextMainRow = (node) => {
    let result = { type: 'none', node: null };
    if (node) {
        const friend = [...node.parentNode.childNodes]
            .filter((a) => Number(a.getAttribute('row-index')) > Number(node.getAttribute('row-index')))
            .sort(function (a, b) {
                const aIdx = Number(a.getAttribute('row-index'));
                const bIdx = Number(b.getAttribute('row-index'));
                return aIdx - bIdx;
            });

        if (friend.length < 1) {
            result = node.classList.contains('ag-rel-row') ? { type: 'last-rel', node: node } : { type: 'last', node: node };
        } else {
            for (let i = 0; i < friend.length; i++) {
                if (!friend[i].classList.contains('ag-rel-row')) {
                    result = { type: 'next', node: friend[i] };
                    break;
                } else {
                    if (i === friend.length - 1) {
                        result = friend[i].classList.contains('ag-rel-row') ? { type: 'last-rel', node: friend[i] } : { type: 'last', node: friend[i] };
                    }
                }
            }
        }
    }
    return result;
};

/**
 * 현재 node 기준으로 이전 메인 기사 찾아서 리턴
 * @param {*} node node
 * @returns {object} { type: none|first|prev, node: node }
 */
export const findPreviousMainRow = (node) => {
    let result = { type: 'none', node: null };
    if (node) {
        const friend = [...node.parentNode.childNodes]
            .filter((a) => Number(a.getAttribute('row-index')) < Number(node.getAttribute('row-index')))
            .sort(function (a, b) {
                const aIdx = Number(a.getAttribute('row-index'));
                const bIdx = Number(b.getAttribute('row-index'));
                return aIdx - bIdx;
            });

        if (friend.length < 1) {
            result = { type: 'first', node };
        } else {
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
    }
    return result;
};

/**
 * .component-work 안에 추가할 hoverBox element
 */
export const makeHoverBox = () => {
    let hoberBox = document.createElement('div');
    hoberBox.classList.add('is-over');
    return hoberBox;
};

/**
 * next 클래스 추가
 * @param {*} node node
 */
export const clearNextStyle = (node) => {
    if (node) {
        node.classList.remove('next');
        node.classList.remove('hover');
    }
};

/**
 * hover 클래스 제거
 * @param {*} node node
 */
export const clearHoverStyle = (node) => {
    if (node) {
        node.classList.remove('hover');
        node.classList.remove('ag-row-hover');
        node.classList.remove('change');
    }
};

/**
 * workElement의 hover 클래스 제거
 * @param {*} node node
 */
export const clearWorkStyle = (node) => {
    node.classList.remove('hover');
};

/**
 * hover 클래스 제거
 * @param {object} nextRow
 */
export const addNextRowStyle = (nextRow) => {
    if (nextRow.type === 'none') return;
    if (nextRow.type === 'next') {
        nextRow.node.classList.add('next');
    } else if (nextRow.type === 'last') {
        nextRow.node.classList.remove('hover');
        nextRow.node.classList.add('next');
    } else if (nextRow.type === 'last-rel') {
        nextRow.node.classList.add('hover');
    }
};

/**
 * 데스킹 워크 ag-grid에 추가할 dropzone 을 생성해주는 함수 + 다른 dropzone에 드래그 시 화면 처리
 * @param {func} onDragStop drag stop 시 실행하는 함수
 * @param {object} sourceGrid 드래그 아이템의 grid
 * @param {object} targetGrid drop target
 * @param {number} currentIndex 타겟 grid리스트에서 현재 넘어온 타겟 grid의 인덱스 (있으면 넘긴다)
 */
export const addDeskingWorkDropzone = (onDragStop, sourceGrid, targetGrid, currentIndex) => {
    const wrapper = targetGrid.api.gridOptionsWrapper;
    if (!wrapper) return null;

    const workElement = findWork(wrapper.layoutElements[0]); // .component-work 찾음
    if (!workElement) return null;

    if (workElement.classList.contains('disabled')) {
        sourceGrid.api.removeRowDropZone({ getContainer: () => workElement });
        return null;
    }

    let next = { idx: -1, node: null };
    let hover = { idx: -1, node: null };
    let hoverBox = makeHoverBox();

    const dropzone = {
        getContainer: () => workElement,
        onDragEnter: () => {
            workElement.appendChild(hoverBox);
        },
        onDragLeave: () => {
            clearWorkStyle(workElement);
            workElement.removeChild(hoverBox);
            clearHoverStyle(hover.node);
            clearNextStyle(next.node);
        },
        onDragging: (source) => {
            let overRow = getRow(source.event);
            const scrollBox = classElementsFromPoint(source.event, 'scrollable');
            autoScroll(scrollBox, { clientX: source.event.clientX, clientY: source.event.clientY });

            if (!overRow) {
                clearNextStyle(next.node);
                clearHoverStyle(hover.node);
                workElement.classList.add('hover');
                hover = { idx: -1, node: null };
                return;
            }

            let overRowIdx = Number(overRow.getAttribute('row-index'));
            if (hover.idx !== overRowIdx) {
                clearNextStyle(next.node);
                clearHoverStyle(hover.node);
                clearWorkStyle(workElement);
                hover = { idx: overRowIdx, node: overRow };
                overRow.classList.add('ag-row-hover');

                const selected = targetGrid.api.getSelectedRows();
                if (selected.length < 1) {
                    // 주기사 추가
                    if (overRow.classList.contains('ag-row-last')) {
                        overRow.classList.add('hover');
                    } else {
                        const nextRow = findNextMainRow(overRow);
                        addNextRowStyle(nextRow);
                        if (nextRow.node) next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
                    }
                } else {
                    // 관련기사 추가
                    if (!overRow.classList.contains('ag-rel-row')) {
                        if (overRow.classList.contains('ag-row-last')) {
                            overRow.classList.add('hover');
                        } else if (overRow.classList.contains('ag-row-selected')) {
                            overRow.classList.add('hover');
                        } else {
                            const nextRow = findNextMainRow(overRow);
                            addNextRowStyle(nextRow);
                            if (nextRow.node) next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
                        }
                    } else {
                        const mainRow = findPreviousMainRow(overRow);
                        if (mainRow.type === 'prev') {
                            const drs = targetGrid.api.getDisplayedRowAtIndex(Number(mainRow.node.getAttribute('row-index')));
                            if (drs.isSelected()) {
                                overRow.classList.add('hover');
                            } else {
                                const nextRow = findNextMainRow(overRow);
                                addNextRowStyle(nextRow);
                                if (nextRow.node) next = { idx: nextRow.node.getAttribute('row-index'), node: nextRow.node };
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

    sourceGrid.api.removeRowDropZone(dropzone);
    sourceGrid.api.addRowDropZone(dropzone);
    return dropzone;
};

/**
 * 관련기사가 포함된 리스트의 validation
 * (관련기사는 이동할 때 반드시 주기사랑 같이 이동돼야함)
 * @param {object} movingDatas 드래그 중인 데이터
 * @param {object} overData 마우스 오버된 row의 데이터
 */
export const getMoveMode = (movingDatas, overData) => {
    let movable = true;

    if (Array.isArray(movingDatas)) {
        // 주기사 목록
        let parentContentIds = movingDatas.filter((node) => !node.data.rel).map((node) => node.data.contentId);

        // 관련기사 목록
        let rels = movingDatas.filter((node) => node.data.rel);

        rels.forEach((relNode) => {
            movable = movable && parentContentIds.includes(relNode.data.parentContentId);
        });
    } else {
        movable = movable && !movingDatas.data.rel;
    }

    return movable;
};
