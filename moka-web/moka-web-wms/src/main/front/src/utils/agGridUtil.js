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
 * @param {object} gridApi agGrid api
 */
export const getDisplayedRows = (gridApi) => {
    let displayedRows = [];
    for (let i = 0; i < gridApi.getDisplayedRowCount(); i++) {
        const data = gridApi.getDisplayedRowAtIndex(i).data;
        displayedRows.push(data);
    }
    return displayedRows;
};

/**
 * ag grid의 모든 row Data 조회
 * @param {object} gridApi agGrid api
 */
export const getAllRowData = (gridApi) => {
    let rowData = [];
    gridApi.forEachNode((node) => rowData.push(node.data));
    return rowData;
};

/**
 * 커서에 위치한 element 전부 찾음 (javascript function)
 * @param {object} event drag event
 * @param {string} className 찾는 element의 클래스명
 */
export const classElementsFromPoint = (event, className) => document.elementsFromPoint(event.clientX, event.clientY).find((r) => r.classList.contains(className));

/**
 * 커서에 따른 자동스크롤
 * x 스크롤도 처리해야하면 그때 추가
 * @param {node} element html element
 * @param {object} param1 clientX, clienY (커서 위치)
 */
export const autoScroll = (element, { clientX, clientY }) => {
    if (element) {
        // elements가 있으면 실행
        const boxPosition = element.getBoundingClientRect();
        // const userX = source.event.clientX;

        if (clientY > boxPosition.top && clientY < boxPosition.top + 40) {
            // 위쪽으로 스크롤
            element.scrollTop = element.scrollTop - 10;
        } else if (clientY < boxPosition.bottom && clientY > boxPosition.bottom - 40) {
            // 아래쪽으로 스크롤
            element.scrollTop = element.scrollTop + 10;
        }
    }
};
