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

/**
 * ag grid의 displayed rows 목록 조회
 * @param {object} api agGrid api
 */
export const getDisplayedRows = (gridApi) => {
    let displayedRows = [];
    for (let i = 0; i < gridApi.getDisplayedRowCount(); i++) {
        const data = gridApi.getDisplayedRowAtIndex(i).data;
        displayedRows.push(data);
    }
    return displayedRows;
};
