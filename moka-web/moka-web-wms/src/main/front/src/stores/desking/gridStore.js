import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

/**
 * action
 */
export const CLEAR_GRID = 'gridStore/CLEAR_GRID';
export const CHANGE_GRID = 'gridStore/CHANGE_GRID';
export const DRAG_STOP_GRID = 'gridStore/DRAG_STOP_GRID';
export const SORT_GRID = 'gridStore/SORT_GRID';

/**
 * action creator
 */
export const clearGrid = createAction(CLEAR_GRID);
// grid state추가
export const changeGrid = createAction(CHANGE_GRID);
// 드래그로 이동
export const dragStopGrid = createAction(
    DRAG_STOP_GRID,
    ({ srcGrid, tgtGrid, srcComponent, tgtComponent, nodes }) => ({
        srcGrid,
        tgtGrid,
        srcComponent,
        tgtComponent,
        nodes
    })
);
// 정렬
export const sortGrid = createAction(SORT_GRID, ({ grid, component }) => ({
    grid,
    component
}));

/**
 * initial
 */
export const initialState = {
    total: 0
};

/**
 * reducer
 */
const gridStore = handleActions(
    {
        // clear
        [CLEAR_GRID]: () => initialState,
        // change grid
        [CHANGE_GRID]: (state) => {
            return produce(state, (draft) => {
                draft.total++;
            });
        }
    },
    initialState
);

export default gridStore;
