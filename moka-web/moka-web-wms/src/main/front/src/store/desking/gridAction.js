import { createAction } from 'redux-actions';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_GRID = 'grid/CLEAR_GRID';
export const clearGrid = createAction(CLEAR_GRID);

/**
 * 그리드 state 추가
 */
export const CHANGE_GRID = 'grid/CHANGE_GRID';
export const changeGrid = createAction(CHANGE_GRID);

/**
 * 드래그 이동
 */
export const DRAG_STOP_GRID = 'grid/DRAG_STOP_GRID';
export const dragStopGrid = createAction(DRAG_STOP_GRID, ({ srcGrid, tgtGrid, srcComponent, tgtComponent, nodes }) => ({
    srcGrid,
    tgtGrid,
    srcComponent,
    tgtComponent,
    nodes,
}));

/**
 * 정렬
 */
export const SORT_GRID = 'grid/SORT_GRID';
export const sortGrid = createAction(SORT_GRID, ({ grid, component }) => ({
    grid,
    component,
}));
